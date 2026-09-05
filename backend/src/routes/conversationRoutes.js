const express = require('express');
const {
  listConversations,
  startConversation,
  getMessages,
  sendMessage,
} = require('../controllers/conversationController');
const { protect } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.use(protect);
router.get('/', listConversations);
router.post('/', validateBody(['otherUserId']), startConversation);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);

module.exports = router;
