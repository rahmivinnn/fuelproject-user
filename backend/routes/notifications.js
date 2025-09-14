const express = require('express');
const { body, validationResult } = require('express-validator');
const admin = require('firebase-admin');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const User = require('../models/User');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// Initialize services
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
}

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @route   POST /api/notifications/send
// @desc    Send notification
// @access  Private
router.post('/send', [
  auth,
  body('type').isIn(['email', 'push', 'sms']).withMessage('Valid notification type required'),
  body('title').trim().isLength({ min: 1 }).withMessage('Title required'),
  body('body').trim().isLength({ min: 1 }).withMessage('Body required'),
  body('data').optional().isObject().withMessage('Data must be an object')
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

    const { type, title, body, data = {} } = req.body;

    let result;
    switch (type) {
      case 'email':
        result = await sendEmail(req.user.email, title, body, data);
        break;
      case 'push':
        result = await sendPushNotification(req.user._id, title, body, data);
        break;
      case 'sms':
        result = await sendSMS(req.user.phone, body);
        break;
    }

    res.json({
      success: true,
      message: 'Notification sent successfully',
      data: { result }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending notification',
      error: error.message
    });
  }
});

// @route   POST /api/notifications/order-update
// @desc    Send order update notification
// @access  Private
router.post('/order-update', [
  auth,
  body('orderId').isMongoId().withMessage('Valid order ID required'),
  body('status').isIn(['confirmed', 'preparing', 'ready', 'completed', 'cancelled']).withMessage('Valid status required'),
  body('message').optional().isString().trim()
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

    const { orderId, status, message } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id
    }).populate('station', 'name address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const statusMessages = {
      confirmed: 'Your fuel order has been confirmed!',
      preparing: 'Your fuel order is being prepared.',
      ready: 'Your fuel order is ready for pickup!',
      completed: 'Your fuel order has been completed.',
      cancelled: 'Your fuel order has been cancelled.'
    };

    const title = 'Order Update';
    const body = message || statusMessages[status] || `Your order status has been updated to ${status}`;

    // Send push notification
    await sendPushNotification(req.user._id, title, body, {
      orderId: order._id.toString(),
      status,
      stationName: order.station.name
    });

    // Send email if user has email notifications enabled
    if (req.user.preferences.notifications.email) {
      await sendEmail(req.user.email, title, body, {
        orderNumber: order.orderNumber,
        stationName: order.station.name,
        status
      });
    }

    // Send SMS if user has SMS notifications enabled and phone number
    if (req.user.preferences.notifications.sms && req.user.phone) {
      await sendSMS(req.user.phone, body);
    }

    res.json({
      success: true,
      message: 'Order update notification sent successfully'
    });
  } catch (error) {
    console.error('Order update notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending order update notification',
      error: error.message
    });
  }
});

// Helper functions
async function sendEmail(email, subject, text, data = {}) {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject,
    text,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A1A1A;">${subject}</h2>
        <p style="color: #333;">${text}</p>
        ${data.orderNumber ? `<p><strong>Order Number:</strong> ${data.orderNumber}</p>` : ''}
        ${data.stationName ? `<p><strong>Station:</strong> ${data.stationName}</p>` : ''}
        <hr style="border: 1px solid #00FF00; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message from Fuel App.</p>
      </div>
    `
  };

  return await sgMail.send(msg);
}

async function sendPushNotification(userId, title, body, data = {}) {
  const user = await User.findById(userId);
  if (!user.fcmToken) {
    throw new Error('User FCM token not found');
  }

  const message = {
    token: user.fcmToken,
    notification: {
      title,
      body
    },
    data: {
      ...data,
      click_action: 'FLUTTER_NOTIFICATION_CLICK'
    }
  };

  return await admin.messaging().send(message);
}

async function sendSMS(phoneNumber, message) {
  if (!phoneNumber) {
    throw new Error('Phone number not provided');
  }

  return await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
}

module.exports = router;
