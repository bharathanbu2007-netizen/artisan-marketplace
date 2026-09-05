const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArtisanProfile', required: true },
    title: { type: String, required: true, trim: true },
    description: {
      english: String,
      hindi: String,
      tamil: String,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    material: String,
    craftType: String,
    keywords: [String],
    images: [{ url: String, publicId: String }],
    originalImage: { url: String, publicId: String },
    aiData: {
      detectedObject: String,
      colors: [String],
      material: String,
      background: String,
      confidence: Number,
    },
    pricing: {
      manufacturerPrice: { type: Number, required: true },
      aiSuggestedMin: Number,
      aiSuggestedMax: Number,
      rawMaterialEstimate: Number,
      currency: { type: String, default: 'INR' },
    },
    inventory: {
      quantity: { type: Number, default: 1 },
      available: { type: Boolean, default: true },
    },
    status: { type: String, enum: ['draft', 'published', 'archived', 'rejected'], default: 'draft' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({
  title: 'text',
  'description.english': 'text',
  category: 1,
});
productSchema.index({ artisanId: 1 });
productSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
