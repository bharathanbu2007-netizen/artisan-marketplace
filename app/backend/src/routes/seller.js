const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const upload = require('../middleware/upload');
const { handleValidation, productValidators } = require('../utils/validators');
const { createProduct, listMyProducts, updateProduct } = require('../controllers/productController');
const { myOrdersAsSeller, updateOrderStatus } = require('../controllers/orderController');

router.use(requireAuth, requireRole('seller'));

router.post(
  '/products',
  upload.fields([{ name: 'images', maxCount: 6 }, { name: 'voiceNote', maxCount: 1 }]),
  createProduct
);
router.get('/products', listMyProducts);
router.patch('/products/:id', updateProduct);

router.get('/orders', myOrdersAsSeller);
router.patch('/orders/:id/status', updateOrderStatus);

module.exports = router;
