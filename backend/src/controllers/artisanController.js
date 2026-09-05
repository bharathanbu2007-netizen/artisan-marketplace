const ArtisanProfile = require('../models/ArtisanProfile');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');

// GET /api/artisans
const listArtisans = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const artisans = await ArtisanProfile.find({ 'verification.status': 'verified' })
    .populate('userId', 'name profileImage')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  return success(res, { artisans });
});

// GET /api/artisans/:id
const getArtisan = asyncHandler(async (req, res) => {
  const artisan = await ArtisanProfile.findById(req.params.id).populate('userId', 'name profileImage email');
  if (!artisan) return failure(res, 'Artisan not found', 404);
  return success(res, { artisan });
});

// GET /api/artisans/:id/products
const getArtisanProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ artisanId: req.params.id, status: 'published' }).sort({ createdAt: -1 });
  return success(res, { products });
});

// PATCH /api/artisans/me
const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await ArtisanProfile.findOneAndUpdate({ userId: req.user._id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!profile) return failure(res, 'Artisan profile not found', 404);
  return success(res, { profile }, 'Profile updated');
});

module.exports = { listArtisans, getArtisan, getArtisanProducts, updateMyProfile };
