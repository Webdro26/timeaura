const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// In-memory OTP store (use Redis in production)
const otpStore = {};

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length !== 10) return res.status(400).json({ message: 'Invalid phone number' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[phone] = { otp, expiry: Date.now() + 5 * 60 * 1000 };

    // In production, send via Twilio:
    // const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({ body: `Your TimeAura OTP is: ${otp}`, from: process.env.TWILIO_PHONE_NUMBER, to: `+91${phone}` });

    console.log(`OTP for ${phone}: ${otp}`); // Remove in production

    res.json({ message: 'OTP sent successfully', otp: process.env.NODE_ENV === 'development' ? otp : undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const record = otpStore[phone];

    if (!record) return res.status(400).json({ message: 'OTP expired or not found' });
    if (Date.now() > record.expiry) {
      delete otpStore[phone];
      return res.status(400).json({ message: 'OTP expired' });
    }
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    delete otpStore[phone];

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, isGuest: false });
    }

    const token = jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Guest login
router.post('/guest', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    let user = await User.findOne({ phone }) || await User.create({ name, phone, email, isGuest: true });
    const token = jwt.sign({ id: user._id, isGuest: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Guest login successful', token, user: { id: user._id, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get('/profile', require('../middleware/auth').authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-otp -otpExpiry').populate('wishlist');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile
router.put('/profile', require('../middleware/auth').authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true }).select('-otp -otpExpiry');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add address
router.post('/address', require('../middleware/auth').authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (req.body.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }
    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Wishlist toggle
router.post('/wishlist/:productId', require('../middleware/auth').authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const idx = user.wishlist.indexOf(req.params.productId);
    if (idx > -1) user.wishlist.splice(idx, 1);
    else user.wishlist.push(req.params.productId);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
