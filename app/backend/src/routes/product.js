const express = require('express');
const router = express.Router();
const { listProducts, getProduct } = require('../controllers/productController');

// Public buyer-facing catalog browsing (no auth required)
router.get('/', listProducts);
router.get('/:id', getProduct);

module.exports = router;
