const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const { optionalAuth } = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});
// Create Razorpay order
router.post('/create-order', optionalAuth, async (req, res) => {
  try {
    const { items, shippingAddress, guestInfo, couponCode } = req.body;

    let subtotal = items.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (coupon) {
        discount = coupon.discountType === 'percentage' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const shippingCharge = subtotal > 999 ? 0 : 99;
    const total = subtotal - discount + shippingCharge;
    const amountInPaise = Math.round(total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Create order in DB
    const order = await Order.create({
      user: req.user?.id,
      guestInfo,
      items: items.map(item => ({
        product: item._id || item.product,
        name: item.name,
        image: item.images?.[0],
        quantity: item.quantity,
        price: item.price,
        discountPrice: item.discountPrice,
      })),
      shippingAddress,
      subtotal,
      discount,
      shippingCharge,
      total,
      couponCode,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending',
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      dbOrderId: order._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify payment
router.post('/verify', optionalAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await Order.findByIdAndUpdate(dbOrderId, { paymentStatus: 'failed' });
      return res.status(400).json({ message: 'Payment verification failed', success: false });
    }

    const order = await Order.findByIdAndUpdate(
      dbOrderId,
      {
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        orderStatus: 'confirmed',
        $push: { statusHistory: { status: 'confirmed', note: 'Payment verified' } }
      },
      { new: true }
    );

    // Clear cart
    if (req.user?.id) await Cart.findOneAndDelete({ user: req.user.id });

    res.json({ success: true, orderId: order.orderId, message: 'Payment successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Payment failed
router.post('/failed', async (req, res) => {
  try {
    const { dbOrderId } = req.body;
    await Order.findByIdAndUpdate(dbOrderId, { paymentStatus: 'failed' });
    res.json({ message: 'Order marked as failed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
