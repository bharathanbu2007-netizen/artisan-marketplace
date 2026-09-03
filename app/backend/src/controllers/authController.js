const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const BuyerProfile = require('../models/BuyerProfile');
const { signToken } = require('../utils/jwt');

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

// POST /api/auth/register  { phone, name, role, preferredLanguage }
async function register(req, res, next) {
  try {
    const { phone, name, role, preferredLanguage } = req.body;
    let user = await User.findOne({ phone });
    if (user) return res.status(409).json({ success: false, message: 'Phone already registered' });

    user = await User.create({ phone, name, role, preferredLanguage });
    if (role === 'seller') await SellerProfile.create({ user: user._id });
    if (role === 'buyer') await BuyerProfile.create({ user: user._id });

    return res.status(201).json({ success: true, message: 'Registered. Please request an OTP to verify.' });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/request-otp  { phone }
async function requestOtp(req, res, next) {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone }).select('+otpHash +otpExpiresAt');
    if (!user) return res.status(404).json({ success: false, message: 'No account with this phone number' });

    const otp = generateOtp();
    user.otpHash = await bcrypt.hash(otp, 10);
    const expiryMin = Number(process.env.OTP_EXPIRY_MINUTES || 5);
    user.otpExpiresAt = new Date(Date.now() + expiryMin * 60 * 1000);
    await user.save();

    // In production this would dispatch via SMS gateway. Logged here for dev/testing.
    console.log(`[auth] OTP for ${phone}: ${otp} (expires in ${expiryMin}m)`);

    return res.json({ success: true, message: 'OTP sent', devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/verify-otp  { phone, otp }
async function verifyOtp(req, res, next) {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone }).select('+otpHash +otpExpiresAt');
    if (!user) return res.status(404).json({ success: false, message: 'No account with this phone number' });
    if (!user.otpHash || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired, please request a new one' });
    }

    const valid = await bcrypt.compare(otp, user.otpHash);
    if (!valid) return res.status(400).json({ success: false, message: 'Incorrect OTP' });

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = signToken({ id: user._id, role: user.role });
    return res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, phone: user.phone, role: user.role, preferredLanguage: user.preferredLanguage },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function me(req, res) {
  return res.json({ success: true, user: req.user });
}

module.exports = { register, requestOtp, verifyOtp, me };
