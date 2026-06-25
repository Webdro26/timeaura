const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { adminMiddleware } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ message: 'Message sent successfully', id: contact._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/', adminMiddleware, async (req, res) => {
  try {
    const messages = await Contact.find().sort('-createdAt');
    res.json(messages);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/read', adminMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
