const Product = require('../models/Product');
const ArtisanProfile = require('../models/ArtisanProfile');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');

// The AI Cataloger produces a plain category NAME (e.g. "Handicrafts"), but
// Product.category is a reference to a real Category document. This finds
// a matching category by name (case-insensitive) or creates one on the fly,
// so publishing never fails with a "cast to ObjectId" error just because the
// AI suggested a category that doesn't exist yet.
async function resolveCategoryId(categoryInput) {
  if (!categoryInput) return undefined;

  // Already a valid ObjectId (e.g. picked from a real dropdown) — use as-is.
  if (/^[a-f\d]{24}$/i.test(categoryInput)) return categoryInput;

  const name = String(categoryInput).trim();
  if (!name) return undefined;

  let category = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
  if (!category) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    category = await Category.create({ name, slug });
  }
  return category._id;
}

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

// GET /api/products/mine  (artisan's own products, ALL statuses — draft + published)
const listMyProducts = asyncHandler(async (req, res) => {
  const artisan = await ArtisanProfile.findOne({ userId: req.user._id });
  if (!artisan) return failure(res, 'Artisan profile required', 403);

  const products = await Product.find({ artisanId: artisan._id })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  return success(res, { products, total: products.length });
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

  const categoryId = await resolveCategoryId(req.body.category);

  const product = await Product.create({
    ...req.body,
    category: categoryId,
    artisanId: artisan._id,
    status: 'draft',
  });
  return success(res, { product }, 'Product created', 201);
});

// PUT /api/products/:id/update
const updateProduct = asyncHandler(async (req, res) => {
  const artisan = await ArtisanProfile.findOne({ userId: req.user._id });
  const product = await Product.findOne({ _id: req.params.id, artisanId: artisan?._id });
  if (!product) return failure(res, 'Product not found or not yours', 404);

  const updates = { ...req.body };
  if (updates.category) updates.category = await resolveCategoryId(updates.category);

  Object.assign(product, updates);
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

module.exports = { listProducts, listMyProducts, getProduct, createProduct, updateProduct, publishProduct, deleteProduct };
