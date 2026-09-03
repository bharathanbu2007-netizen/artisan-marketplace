const mongoose = require('mongoose');

const sellerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    craftType: { type: String, trim: true },
    region: { type: String, trim: true },
    bio: { type: String, trim: true },
    languagesSpoken: [{ type: String, enum: ['en', 'hi', 'ta'] }],
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SellerProfile', sellerProfileSchema);
