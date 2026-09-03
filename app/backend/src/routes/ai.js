const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { suggestPriceEndpoint, catalogVoiceEndpoint, enhanceImageEndpoint } = require('../controllers/aiController');

router.use(requireAuth);

router.post('/pricing/suggest', suggestPriceEndpoint);
router.post('/catalog/voice', upload.single('voiceNote'), catalogVoiceEndpoint);
router.post('/image/enhance', upload.single('image'), enhanceImageEndpoint);

module.exports = router;
