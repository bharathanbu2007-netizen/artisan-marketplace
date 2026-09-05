const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');

// GET /api/conversations
const listConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('participants', 'name profileImage')
    .populate('productId', 'title images')
    .sort({ lastMessageAt: -1 });
  return success(res, { conversations });
});

// POST /api/conversations  — get-or-create a conversation with another user about a product
const startConversation = asyncHandler(async (req, res) => {
  const { otherUserId, productId } = req.body;

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, otherUserId] },
    productId: productId || null,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, otherUserId],
      productId: productId || undefined,
    });
  }

  return success(res, { conversation }, 'Conversation ready', 201);
});

// GET /api/conversations/:id/messages
const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation || !conversation.participants.some((p) => p.toString() === req.user._id.toString())) {
    return failure(res, 'Conversation not found', 404);
  }

  const messages = await Message.find({ conversationId: req.params.id }).sort({ createdAt: 1 });
  return success(res, { messages });
});

// POST /api/conversations/:id/messages  — REST fallback; live delivery goes through Socket.IO
const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return failure(res, 'Conversation not found', 404);

  const receiverId = conversation.participants.find((p) => p.toString() !== req.user._id.toString());

  const message = await Message.create({
    conversationId: conversation._id,
    senderId: req.user._id,
    receiverId,
    type: req.body.type || 'text',
    text: req.body.text,
    attachments: req.body.attachments || [],
    productId: req.body.productId,
  });

  conversation.lastMessage = req.body.text || `[${req.body.type}]`;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  req.app.get('io')?.to(`user:${receiverId}`).emit('message:new', message);

  return success(res, { message }, 'Message sent', 201);
});

module.exports = { listConversations, startConversation, getMessages, sendMessage };
