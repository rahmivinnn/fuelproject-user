const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const Station = require('../models/Station');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/stations/nearby
// @desc    Find nearby fuel stations
// @access  Public
router.get('/nearby', [
  query('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  query('lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  query('radius').optional().isFloat({ min: 0.1, max: 100 }).withMessage('Radius must be between 0.1 and 100 km'),
  query('fuelType').optional().isIn(['gasoline', 'diesel', 'electric', 'lpg', 'cng', 'premium_gasoline', 'premium_diesel']),
  query('brand').optional().isString().trim(),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
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
      lat,
      lng,
      radius = 10,
      fuelType,
      brand,
      limit = 20
    } = req.query;

    let stations = await Station.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius),
      fuelType
    ).limit(parseInt(limit));

    // Filter by brand if specified
    if (brand) {
      stations = stations.filter(station => 
        station.brand.toLowerCase().includes(brand.toLowerCase())
      );
    }

    // Add distance to each station
    const stationsWithDistance = stations.map(station => {
      const stationObj = station.toObject();
      stationObj.distance = station.getDistance(parseFloat(lat), parseFloat(lng));
      return stationObj;
    });

    // Sort by distance
    stationsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      data: {
        stations: stationsWithDistance,
        count: stationsWithDistance.length,
        searchParams: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          radius: parseFloat(radius),
          fuelType,
          brand
        }
      }
    });
  } catch (error) {
    console.error('Error finding nearby stations:', error);
    res.status(500).json({
      success: false,
      message: 'Error finding nearby stations',
      error: error.message
    });
  }
});

// @route   GET /api/stations/:id
// @desc    Get station details
// @access  Public
router.get('/:id', [
  param('id').isMongoId().withMessage('Valid station ID required')
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

    const station = await Station.findById(req.params.id);
    
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    res.json({
      success: true,
      data: { station }
    });
  } catch (error) {
    console.error('Error getting station:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting station details',
      error: error.message
    });
  }
});

// @route   GET /api/stations/search
// @desc    Search stations by name or location
// @access  Public
router.get('/search', [
  query('q').isString().trim().isLength({ min: 1 }).withMessage('Search query required'),
  query('lat').optional().isFloat({ min: -90, max: 90 }),
  query('lng').optional().isFloat({ min: -180, max: 180 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
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

    const { q, lat, lng, limit = 20 } = req.query;
    const searchQuery = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { 'address.city': { $regex: q, $options: 'i' } },
        { 'address.street': { $regex: q, $options: 'i' } }
      ],
      isActive: true
    };

    let stations = await Station.find(searchQuery).limit(parseInt(limit));

    // If coordinates provided, add distance and sort by distance
    if (lat && lng) {
      stations = stations.map(station => {
        const stationObj = station.toObject();
        stationObj.distance = station.getDistance(parseFloat(lat), parseFloat(lng));
        return stationObj;
      });

      stations.sort((a, b) => a.distance - b.distance);
    }

    res.json({
      success: true,
      data: {
        stations,
        count: stations.length,
        searchQuery: q
      }
    });
  } catch (error) {
    console.error('Error searching stations:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching stations',
      error: error.message
    });
  }
});

// @route   GET /api/stations/brands
// @desc    Get all available station brands
// @access  Public
router.get('/brands', async (req, res) => {
  try {
    const brands = await Station.distinct('brand', { isActive: true });
    
    res.json({
      success: true,
      data: { brands }
    });
  } catch (error) {
    console.error('Error getting brands:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting station brands',
      error: error.message
    });
  }
});

// @route   GET /api/stations/fuel-types
// @desc    Get all available fuel types
// @access  Public
router.get('/fuel-types', async (req, res) => {
  try {
    const fuelTypes = await Station.getFuelTypes();
    
    res.json({
      success: true,
      data: { fuelTypes }
    });
  } catch (error) {
    console.error('Error getting fuel types:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting fuel types',
      error: error.message
    });
  }
});

// @route   PUT /api/stations/:id/rating
// @desc    Update station rating
// @access  Private
router.put('/:id/rating', [
  auth,
  param('id').isMongoId().withMessage('Valid station ID required'),
  body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
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

    const { rating, comment } = req.body;
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    // Update rating
    const newCount = station.rating.count + 1;
    const newAverage = ((station.rating.average * station.rating.count) + rating) / newCount;
    
    station.rating.average = newAverage;
    station.rating.count = newCount;

    await station.save();

    res.json({
      success: true,
      message: 'Rating updated successfully',
      data: {
        rating: station.rating
      }
    });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating station rating',
      error: error.message
    });
  }
});

module.exports = router;
