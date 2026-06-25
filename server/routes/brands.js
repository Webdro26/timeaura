const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const { adminMiddleware } = require('../middleware/auth');

const makeSlug = (name = '') =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

router.get('/', async (req, res) => {
  try {
    const { type } = req.query;

    const filter = { isActive: true };

    if (type === 'watch') {
      filter.type = { $in: ['watch', 'both'] };
    }

    if (type === 'sunglasses') {
      filter.type = { $in: ['sunglasses', 'both'] };
    }

    const brands = await Brand.find(filter).sort('name');
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const filter = {
      slug: req.params.slug,
      isActive: true,
    };

    if (req.query.type === 'watch') {
      filter.type = { $in: ['watch', 'both'] };
    }

    if (req.query.type === 'sunglasses') {
      filter.type = { $in: ['sunglasses', 'both'] };
    }

    const brand = await Brand.findOne(filter);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', adminMiddleware, async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      slug: req.body.slug || makeSlug(req.body.name),
      logo: req.body.logo || '',
      description: req.body.description || '',
      type: req.body.type || 'watch',
    };

    const brand = await Brand.create(payload);
    res.status(201).json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      slug: req.body.slug || makeSlug(req.body.name),
      logo: req.body.logo || '',
      description: req.body.description || '',
      type: req.body.type || 'watch',
    };

    const brand = await Brand.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    res.json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await Brand.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;