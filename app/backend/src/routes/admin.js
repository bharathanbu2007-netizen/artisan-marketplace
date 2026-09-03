const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const {
  listUsers,
  setUserActive,
  listPendingSellers,
  approveSeller,
  listPendingProducts,
  reviewProduct,
  reportsSummary,
} = require('../controllers/adminController');

router.use(requireAuth, requireRole('admin'));

router.get('/users', listUsers);
router.patch('/users/:id/status', setUserActive);
router.get('/sellers/pending', listPendingSellers);
router.patch('/sellers/:id/approve', approveSeller);
router.get('/products/pending', listPendingProducts);
router.patch('/products/:id/review', reviewProduct);
router.get('/reports/summary', reportsSummary);

module.exports = router;
