const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadPhoto } = require('../controllers/uploadController');

const router = express.Router();

router.post('/', protect, upload.single('image'), uploadPhoto);

module.exports = router;
