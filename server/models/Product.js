const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  category: { type: String, enum: ['watch', 'sunglasses'], required: true },
  gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }, // for watches
  glassCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // for sunglasses
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  tags: [{
    type: String,
    enum: ['bestseller', 'new', 'trending', 'featured']
  }],
  specifications: [{
    key: String,
    value: String
  }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
