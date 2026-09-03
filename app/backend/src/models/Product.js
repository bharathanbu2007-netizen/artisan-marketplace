const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    // Auto-generated multilingual catalog fields (from voice cataloging pipeline)
    translations: {
      en: { title: String, description: String },
      hi: { title: String, description: String },
      ta: { title: String, description: String },
    },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String }],
    images: [{ type: String }],
    enhancedImages: [{ type: String }],
    basePrice: { type: Number, required: true, min: 0 },
    // Dynamic pricing suggestion produced by pricingService
    suggestedPrice: { type: Number },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 1, min: 0 },
    status: { type: String, enum: ['draft', 'pending_review', 'active', 'rejected'], default: 'pending_review' },
    materials: [{ type: String }],
    dimensions: { type: String },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
