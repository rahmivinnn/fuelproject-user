const express = require('express');
const { body, param, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: { user: req.user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting profile',
      error: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date required')
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

    const { firstName, lastName, phone, dateOfBirth } = req.body;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (phone) updates.phone = phone;
    if (dateOfBirth) updates.dateOfBirth = new Date(dateOfBirth);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// @route   POST /api/users/vehicles
// @desc    Add vehicle
// @access  Private
router.post('/vehicles', [
  auth,
  body('make').trim().isLength({ min: 1 }).withMessage('Make is required'),
  body('model').trim().isLength({ min: 1 }).withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year required'),
  body('fuelType').isIn(['gasoline', 'diesel', 'electric', 'hybrid', 'lpg', 'cng']).withMessage('Valid fuel type required'),
  body('licensePlate').optional().trim().isLength({ max: 20 }),
  body('isDefault').optional().isBoolean()
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

    const { make, model, year, fuelType, licensePlate, isDefault = false } = req.body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await User.findByIdAndUpdate(req.user._id, {
        $set: { 'vehicles.$[].isDefault': false }
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          vehicles: {
            make,
            model,
            year,
            fuelType,
            licensePlate,
            isDefault
          }
        }
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Vehicle added successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding vehicle',
      error: error.message
    });
  }
});

// @route   PUT /api/users/vehicles/:vehicleId
// @desc    Update vehicle
// @access  Private
router.put('/vehicles/:vehicleId', [
  auth,
  param('vehicleId').isMongoId().withMessage('Valid vehicle ID required'),
  body('make').optional().trim().isLength({ min: 1 }),
  body('model').optional().trim().isLength({ min: 1 }),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  body('fuelType').optional().isIn(['gasoline', 'diesel', 'electric', 'hybrid', 'lpg', 'cng']),
  body('licensePlate').optional().trim().isLength({ max: 20 }),
  body('isDefault').optional().isBoolean()
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

    const { vehicleId } = req.params;
    const updates = req.body;

    // If setting as default, unset other defaults
    if (updates.isDefault) {
      await User.findByIdAndUpdate(req.user._id, {
        $set: { 'vehicles.$[].isDefault': false }
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, 'vehicles._id': vehicleId },
      { $set: Object.keys(updates).reduce((acc, key) => {
        acc[`vehicles.$.${key}`] = updates[key];
        return acc;
      }, {}) },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle',
      error: error.message
    });
  }
});

// @route   DELETE /api/users/vehicles/:vehicleId
// @desc    Delete vehicle
// @access  Private
router.delete('/vehicles/:vehicleId', [
  auth,
  param('vehicleId').isMongoId().withMessage('Valid vehicle ID required')
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

    const { vehicleId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { vehicles: { _id: vehicleId } } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      message: 'Vehicle deleted successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vehicle',
      error: error.message
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  auth,
  body('language').optional().isIn(['en', 'es', 'fr', 'ar', 'zh']).withMessage('Valid language required'),
  body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Valid currency code required'),
  body('units').optional().isIn(['metric', 'imperial']).withMessage('Valid units required'),
  body('notifications.email').optional().isBoolean(),
  body('notifications.push').optional().isBoolean(),
  body('notifications.sms').optional().isBoolean()
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

    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { preferences: { ...req.user.preferences, ...updates } } },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message
    });
  }
});

module.exports = router;
