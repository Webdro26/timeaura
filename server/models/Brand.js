const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true },
  logo: { type: String, default: '' },
  description: { type: String, default: '' },

  // watch / sunglasses / both
  type: {
    type: String,
    enum: ['watch', 'sunglasses', 'both'],
    default: 'watch',
  },

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

brandSchema.index({ slug: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Brand', brandSchema);