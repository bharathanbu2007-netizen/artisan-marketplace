const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  publishProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('artisan'), validateBody(['title']), createProduct);
router.put('/:id/update', protect, authorize('artisan'), updateProduct);
router.post('/:id/publish', protect, authorize('artisan'), publishProduct);
router.delete('/:id', protect, authorize('artisan', 'admin'), deleteProduct);

module.exports = router;
