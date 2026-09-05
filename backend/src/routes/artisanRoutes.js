const express = require('express');
const {
  listArtisans,
  getArtisan,
  getArtisanProducts,
  updateMyProfile,
} = require('../controllers/artisanController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.get('/', listArtisans);
router.patch('/me', protect, authorize('artisan'), updateMyProfile);
router.get('/:id', getArtisan);
router.get('/:id/products', getArtisanProducts);

module.exports = router;
