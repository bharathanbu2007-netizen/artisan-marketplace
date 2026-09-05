const express = require('express');
const {
  analyzeProduct,
  enhanceImage,
  analyzeScene,
  generateCatalog,
  suggestPrice,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.use(protect, authorize('artisan'));
router.post('/analyze-product', analyzeProduct);
router.post('/enhance-image', enhanceImage);
router.post('/analyze-scene', analyzeScene);
router.post('/catalog', generateCatalog);
router.post('/price', suggestPrice);

module.exports = router;
