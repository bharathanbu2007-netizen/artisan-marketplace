const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'artisan', 'admin'], default: 'buyer' },
    profileImage: { url: String, publicId: String },
    language: { type: String, default: 'en' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastSeenAt: Date,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
