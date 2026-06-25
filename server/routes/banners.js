const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { adminMiddleware } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort('order');
    res.json(banners);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: get all banners (active + inactive)
router.get('/admin/all', adminMiddleware, async (req, res) => {
  try {
    const banners = await Banner.find().sort('order');
    res.json(banners);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', adminMiddleware, async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(banner);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
