const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { adminMiddleware } = require('../middleware/auth');

router.post('/images', adminMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const urls = req.files.map(f => f.path);
    res.json({ urls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
