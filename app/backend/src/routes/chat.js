const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { startConversation, listConversations, getMessages } = require('../controllers/chatController');

router.use(requireAuth);

router.post('/conversations', startConversation);
router.get('/conversations', listConversations);
router.get('/conversations/:id/messages', getMessages);

module.exports = router;
