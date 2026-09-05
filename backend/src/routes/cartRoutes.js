const express = require('express');
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/', validateBody(['productId']), addToCart);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
