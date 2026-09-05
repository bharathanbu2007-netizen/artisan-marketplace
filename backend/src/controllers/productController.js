const Product = require('../models/Product');
const ArtisanProfile = require('../models/ArtisanProfile');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');

// GET /api/products  (marketplace browse/search)
const listProducts = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;

  const filter = { status: 'published' };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter['pricing.manufacturerPrice'] = {};
    if (minPrice) filter['pricing.manufacturerPrice'].$gte = Number(minPrice);
    if (maxPrice) filter['pricing.manufacturerPrice'].$lte = Number(maxPrice);
  }

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .populate({ path: 'artisanId', select: 'businessName location verification', populate: { path: 'userId', select: 'name' } })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);
  return success(res, { products, total, page: Number(page), limit: Number(limit) });
});

// GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    .populate('category', 'name slug')
    .populate({ path: 'artisanId', populate: { path: 'userId', select: 'name profileImage' } });
  if (!product) return failure(res, 'Product not found', 404);
  return success(res, { product });
});

// POST /api/products  (create draft — artisan only)
const createProduct = asyncHandler(async (req, res) => {
  const artisan = await ArtisanProfile.findOne({ userId: req.user._id });
  if (!artisan) return failure(res, 'Artisan profile required', 403);

  const product = await Product.create({ ...req.body, artisanId: artisan._id, status: 'draft' });
  return success(res, { product }, 'Product created', 201);
});

// PUT /api/products/:id/update
const updateProduct = asyncHandler(async (req, res) => {
  const artisan = await ArtisanProfile.findOne({ userId: req.user._id });
  const product = await Product.findOne({ _id: req.params.id, artisanId: artisan?._id });
  if (!product) return failure(res, 'Product not found or not yours', 404);

  Object.assign(product, req.body);
  await product.save();
  return success(res, { product }, 'Product updated');
});

// POST /api/products/:id/publish  (server verifies role + ownership + price)
const publishProduct = asyncHandler(async (req, res, next) => {
  const artisan = await ArtisanProfile.findOne({ userId: req.user._id });
  if (!artisan) return failure(res, 'Artisan profile required', 403);

  const product = await Product.findOne({ _id: req.params.id, artisanId: artisan._id });
  if (!product) return failure(res, 'Product not found or not yours', 404);

  if (!product.pricing?.manufacturerPrice || product.pricing.manufacturerPrice <= 0) {
    return failure(res, 'A valid manufacturer price is required before publishing', 422);
  }
  if (!product.images?.length) {
    return failure(res, 'At least one product image is required before publishing', 422);
  }

  product.status = 'published';
  await product.save();

  artisan.statistics.products += 1;
  await artisan.save();

  req.app.get('io')?.emit('product:published', { productId: product._id, artisanId: artisan._id });

  return success(res, { product }, 'Product published');
});

// DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const artisan = await ArtisanProfile.findOne({ userId: req.user._id });
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, artisanId: artisan?._id },
    { status: 'archived' },
    { new: true }
  );
  if (!product) return failure(res, 'Product not found or not yours', 404);
  return success(res, {}, 'Product archived');
});

module.exports = { listProducts, getProduct, createProduct, updateProduct, publishProduct, deleteProduct };
