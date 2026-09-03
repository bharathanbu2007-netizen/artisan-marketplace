const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');

// GET /api/admin/users
async function listUsers(req, res, next) {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id/status  { isActive }
async function setUserActive(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/sellers/pending
async function listPendingSellers(req, res, next) {
  try {
    const pending = await SellerProfile.find({ isApproved: false }).populate('user', 'name phone preferredLanguage');
    return res.json({ success: true, sellers: pending });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/sellers/:id/approve
async function approveSeller(req, res, next) {
  try {
    const profile = await SellerProfile.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, approvedAt: new Date() },
      { new: true }
    );
    if (!profile) return res.status(404).json({ success: false, message: 'Seller profile not found' });
    return res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/products/pending
async function listPendingProducts(req, res, next) {
  try {
    const products = await Product.find({ status: 'pending_review' }).populate('seller', 'name');
    return res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/products/:id/review  { status } - active | rejected
async function reviewProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/reports/summary
async function reportsSummary(req, res, next) {
  try {
    const [totalUsers, totalSellers, totalBuyers, totalProducts, activeProducts, totalOrders, revenueAgg] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'seller' }),
      User.countDocuments({ role: 'buyer' }),
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    ]);
    return res.json({
      success: true,
      summary: {
        totalUsers,
        totalSellers,
        totalBuyers,
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue: revenueAgg[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
  setUserActive,
  listPendingSellers,
  approveSeller,
  listPendingProducts,
  reviewProduct,
  reportsSummary,
};
