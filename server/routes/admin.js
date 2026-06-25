const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { adminMiddleware } = require('../middleware/auth');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, process.env.JWT_ADMIN_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard analytics
router.get('/dashboard', adminMiddleware, async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, revenueData] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ isGuest: false }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const recentOrders = await Order.find().sort('-createdAt').limit(10).populate('user', 'name phone');
    const totalRevenue = revenueData[0]?.total || 0;

    // Monthly revenue chart data
    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // Low stock products (stock <= 5)
    const lowStockProducts = await Product.find({ isActive: true, stock: { $lte: 5 } })
      .sort('stock')
      .limit(10)
      .populate('brand', 'name')
      .populate('glassCategory', 'name');

    res.json({ totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders, monthlyRevenue, lowStockProducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders
router.get('/orders', adminMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { orderStatus: status } : {};
    const orders = await Order.find(filter)
      .sort('-createdAt')
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('user', 'name phone');
    const total = await Order.countDocuments(filter);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.put('/orders/:id', adminMiddleware, async (req, res) => {
  try {
    const { orderStatus, note } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus,
        $push: { statusHistory: { status: orderStatus, note } }
      },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt').select('-otp -otpExpiry');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
