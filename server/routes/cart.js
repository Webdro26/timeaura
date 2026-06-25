const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { optionalAuth } = require('../middleware/auth');

const getCartFilter = (req) => {
  if (req.user?.id) return { user: req.user.id };
  const sessionId = req.headers['x-session-id'];
  if (sessionId) return { sessionId };
  return null;
};

// Get cart
router.get('/', optionalAuth, async (req, res) => {
  try {
    const filter = getCartFilter(req);
    if (!filter) return res.json({ items: [], subtotal: 0, total: 0 });

    const cart = await Cart.findOne(filter).populate('items.product');
    if (!cart) return res.json({ items: [], subtotal: 0, total: 0 });

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product?.discountPrice || item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    res.json({ ...cart.toObject(), subtotal, total: subtotal - (cart.discount || 0) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to cart
router.post('/add', optionalAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const filter = getCartFilter(req);
    if (!filter) return res.status(400).json({ message: 'No session' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne(filter);
    if (!cart) cart = new Cart({ ...filter, items: [] });

    const existingItem = cart.items.find(i => i.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.discountPrice || product.price });
    }

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update quantity
router.put('/update', optionalAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const filter = getCartFilter(req);
    const cart = await Cart.findOne(filter);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) {
      if (quantity <= 0) cart.items = cart.items.filter(i => i.product.toString() !== productId);
      else item.quantity = quantity;
    }
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', optionalAuth, async (req, res) => {
  try {
    const filter = getCartFilter(req);
    const cart = await Cart.findOne(filter);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Apply coupon
router.post('/coupon', optionalAuth, async (req, res) => {
  try {
    const { code } = req.body;
    const filter = getCartFilter(req);
    const cart = await Cart.findOne(filter).populate('items.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(400).json({ message: 'Invalid coupon code' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon expired' });
    if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });

    const subtotal = cart.items.reduce((sum, item) => sum + (item.product?.discountPrice || item.product?.price || 0) * item.quantity, 0);
    if (subtotal < coupon.minOrderAmount) return res.status(400).json({ message: `Minimum order amount is ₹${coupon.minOrderAmount}` });

    let discount = coupon.discountType === 'percentage' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

    cart.couponCode = coupon.code;
    cart.discount = discount;
    await cart.save();

    res.json({ discount, couponCode: coupon.code, message: `Coupon applied! You save ₹${discount.toFixed(2)}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove coupon
router.delete('/coupon', optionalAuth, async (req, res) => {
  try {
    const filter = getCartFilter(req);
    await Cart.findOneAndUpdate(filter, { couponCode: null, discount: 0 });
    res.json({ message: 'Coupon removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear cart
router.delete('/clear', optionalAuth, async (req, res) => {
  try {
    const filter = getCartFilter(req);
    await Cart.findOneAndDelete(filter);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
