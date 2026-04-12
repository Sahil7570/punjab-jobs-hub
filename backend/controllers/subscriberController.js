const crypto = require('crypto');
const Subscriber = require('../models/Subscriber');
const { sendWelcomeEmail } = require('../utils/email');

// POST /api/subscribers
const subscribe = async (req, res) => {
  try {
    const { email, name, categories } = req.body;

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ success: false, message: 'This email is already subscribed.' });
      }
      // Re-activate
      existing.isActive = true;
      existing.name = name || existing.name;
      existing.categories = categories || existing.categories;
      await existing.save();
      return res.json({ success: true, message: 'Welcome back! Your subscription is re-activated.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const subscriber = await Subscriber.create({
      email,
      name: name || '',
      categories: categories || ['All'],
      token,
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(subscriber).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully! Check your email for confirmation.',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already subscribed.' });
    }
    res.status(500).json({ success: false, message: 'Subscription failed. Please try again.' });
  }
};

// GET /api/subscribers/unsubscribe?token=xxx
const unsubscribe = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Invalid unsubscribe link.' });
    }

    const subscriber = await Subscriber.findOneAndUpdate(
      { token },
      { isActive: false },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscription not found.' });
    }

    res.json({ success: true, message: 'You have been unsubscribed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to unsubscribe.' });
  }
};

module.exports = { subscribe, unsubscribe };
