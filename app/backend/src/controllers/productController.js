const Product = require('../models/Product');
const { suggestPrice } = require('../services/pricingService');
const { enhanceProductImage } = require('../services/imageService');
const { catalogFromVoice } = require('../services/catalogService');

// POST /api/seller/products  (multipart: images[], voiceNote?) - seller only
async function createProduct(req, res, next) {
  try {
    const sellerId = req.user._id;
    const files = req.files || {};
    const imagePaths = (files.images || []).map((f) => f.path);

    let title = req.body.title;
    let description = req.body.description;
    let translations;

    // If a voice note was provided, run the smart cataloging pipeline to
    // auto-fill title/description/translations from spoken description.
    if (files.voiceNote && files.voiceNote[0]) {
      const spokenLanguage = req.body.spokenLanguage || req.user.preferredLanguage || 'en';
      const catalog = await catalogFromVoice(files.voiceNote[0].path, spokenLanguage);
      title = title || catalog.title;
      description = description || catalog.description;
      translations = catalog.translations;
    }

    const enhancedImages = [];
    for (const p of imagePaths) {
      try {
        enhancedImages.push(await enhanceProductImage(p));
      } catch (e) {
        console.error('[productController] image enhance failed:', e.message);
      }
    }

    const basePrice = Number(req.body.basePrice || req.body.price);
    const { suggestedPrice } = await suggestPrice({
      category: req.body.category,
      basePrice,
      materials: req.body.materials ? String(req.body.materials).split(',') : [],
    });

    const product = await Product.create({
      seller: sellerId,
      title,
      description,
      translations,
      category: req.body.category,
      tags: req.body.tags ? String(req.body.tags).split(',').map((t) => t.trim()) : [],
      images: imagePaths,
      enhancedImages,
      basePrice,
      suggestedPrice,
      price: req.body.price ? Number(req.body.price) : suggestedPrice,
      stock: req.body.stock ? Number(req.body.stock) : 1,
      materials: req.body.materials ? String(req.body.materials).split(',') : [],
      dimensions: req.body.dimensions,
      status: 'pending_review',
    });

    return res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

// GET /api/products?category=&search=&lang=  - public buyer catalog
async function listProducts(req, res, next) {
  try {
    const { category, search, lang = 'en', page = 1, limit = 20 } = req.query;
    const filter = { status: 'active' };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate('seller', 'name');

    const localized = products.map((p) => {
      const t = p.translations && p.translations[lang];
      return {
        ...p.toObject(),
        title: t?.title || p.title,
        description: t?.description || p.description,
      };
    });

    return res.json({ success: true, products: localized });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id?lang=
async function getProduct(req, res, next) {
  try {
    const { lang = 'en' } = req.query;
    const product = await Product.findById(req.params.id).populate('seller', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const t = product.translations && product.translations[lang];
    return res.json({
      success: true,
      product: { ...product.toObject(), title: t?.title || product.title, description: t?.description || product.description },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/seller/products - seller's own listings
async function listMyProducts(req, res, next) {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/seller/products/:id - seller edits own listing
async function updateProduct(req, res, next) {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const editable = ['title', 'description', 'category', 'tags', 'price', 'stock', 'materials', 'dimensions'];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });
    product.status = 'pending_review'; // re-review after edits
    await product.save();

    return res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

module.exports = { createProduct, listProducts, getProduct, listMyProducts, updateProduct };
