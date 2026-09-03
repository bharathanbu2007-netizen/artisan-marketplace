const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { addToCart, getCart, placeOrder, myOrdersAsBuyer } = require('../controllers/orderController');

router.use(requireAuth, requireRole('buyer'));

router.get('/cart', getCart);
router.post('/cart', addToCart);
router.post('/orders', placeOrder);
router.get('/orders', myOrdersAsBuyer);

module.exports = router;
