const express = require('express');
const { createOrder, listOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.use(protect);
router.get('/', listOrders);
router.post('/', authorize('buyer'), validateBody(['items']), createOrder);
router.get('/:id', getOrder);
router.patch('/:id', authorize('artisan', 'admin'), updateOrderStatus);

module.exports = router;
