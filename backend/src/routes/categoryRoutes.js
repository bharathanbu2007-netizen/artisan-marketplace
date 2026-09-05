const express = require('express');
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.get('/', listCategories);
router.post('/', protect, authorize('admin'), validateBody(['name']), createCategory);
router.patch('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
