const mongoose = require('mongoose');

const artisanProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    craftType: { type: String, trim: true },
    description: { type: String, trim: true },
    location: {
      state: String,
      district: String,
      village: String,
    },
    yearsOfExperience: { type: Number, default: 0 },
    verification: {
      status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
      documents: [{ url: String, publicId: String }],
    },
    statistics: {
      products: { type: Number, default: 0 },
      orders: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ArtisanProfile', artisanProfileSchema);
