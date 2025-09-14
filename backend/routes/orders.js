const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Station = require('../models/Station');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/orders
// @desc    Create new fuel order
// @access  Private
router.post('/', [
  auth,
  body('stationId').isMongoId().withMessage('Valid station ID required'),
  body('fuelType').isIn(['gasoline', 'diesel', 'electric', 'lpg', 'cng', 'premium_gasoline', 'premium_diesel']).withMessage('Valid fuel type required'),
  body('quantity').isFloat({ min: 0.1 }).withMessage('Quantity must be at least 0.1'),
  body('unit').optional().isIn(['liters', 'gallons', 'kWh']).withMessage('Valid unit required'),
  body('scheduledTime').isISO8601().withMessage('Valid scheduled time required'),
  body('vehicle').optional().isObject().withMessage('Vehicle information must be an object'),
  body('addOns').optional().isArray().withMessage('Add-ons must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      stationId,
      fuelType,
      quantity,
      unit = 'liters',
      scheduledTime,
      vehicle,
      addOns = []
    } = req.body;

    // Verify station exists and is active
    const station = await Station.findById(stationId);
    if (!station || !station.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Station not found or inactive'
      });
    }

    // Check if fuel type is available at station
    const fuel = station.fuelTypes.find(f => f.type === fuelType && f.isAvailable);
    if (!fuel) {
      return res.status(400).json({
        success: false,
        message: 'Fuel type not available at this station'
      });
    }

    // Check if station is open at scheduled time
    const scheduledDate = new Date(scheduledTime);
    if (scheduledDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in the future'
      });
    }

    // Calculate pricing
    const basePrice = fuel.price * quantity;
    const tax = basePrice * 0.1; // 10% tax (adjust based on location)
    const serviceFee = basePrice * 0.02; // 2% service fee
    const addOnsTotal = addOns.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
    const totalAmount = basePrice + tax + serviceFee + addOnsTotal;

    // Create order
    const order = new Order({
      user: req.user._id,
      station: stationId,
      fuelType,
      quantity,
      unit,
      pricing: {
        basePrice,
        fuelPrice: fuel.price,
        tax,
        serviceFee,
        totalAmount,
        currency: fuel.currency
      },
      pickup: {
        scheduledTime: scheduledDate
      },
      vehicle: vehicle || req.user.getDefaultVehicle(),
      addOns,
      status: 'pending'
    });

    await order.save();

    // Generate QR code
    order.generateQRCode();
    await order.save();

    // Populate station details
    await order.populate('station', 'name brand address contact');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', [
  auth,
  query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'ready', 'in_progress', 'completed', 'cancelled', 'expired']),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('skip').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { status, limit = 20, skip = 0 } = req.query;
    
    const query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('station', 'name brand address')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: total > parseInt(skip) + parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting orders',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order details
// @access  Private
router.get('/:id', [
  auth,
  param('id').isMongoId().withMessage('Valid order ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('station', 'name brand address contact operatingHours');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting order details',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', [
  auth,
  param('id').isMongoId().withMessage('Valid order ID required'),
  body('reason').optional().isString().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { reason } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this time'
      });
    }

    await order.updateStatus('cancelled', {
      reason,
      cancelledBy: 'user'
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/rating
// @desc    Rate order
// @access  Private
router.put('/:id/rating', [
  auth,
  param('id').isMongoId().withMessage('Valid order ID required'),
  body('stationRating').isFloat({ min: 1, max: 5 }).withMessage('Station rating must be between 1 and 5'),
  body('serviceRating').isFloat({ min: 1, max: 5 }).withMessage('Service rating must be between 1 and 5'),
  body('comment').optional().isString().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { stationRating, serviceRating, comment } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'completed'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Completed order not found'
      });
    }

    if (order.rating.station) {
      return res.status(400).json({
        success: false,
        message: 'Order already rated'
      });
    }

    order.rating = {
      station: stationRating,
      service: serviceRating,
      comment,
      ratedAt: new Date()
    };

    await order.save();

    // Update station rating
    const station = await Station.findById(order.station);
    if (station) {
      const newCount = station.rating.count + 1;
      const newAverage = ((station.rating.average * station.rating.count) + stationRating) / newCount;
      station.rating.average = newAverage;
      station.rating.count = newCount;
      await station.save();
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Rate order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rating order',
      error: error.message
    });
  }
});

module.exports = router;
