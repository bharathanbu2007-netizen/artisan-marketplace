const express = require('express');
const { getVersion, setVersion } = require('../controllers/appController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.get('/version', getVersion);
router.post('/version', protect, authorize('admin'), setVersion);

module.exports = router;
