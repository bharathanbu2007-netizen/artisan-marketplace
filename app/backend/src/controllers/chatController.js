const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// POST /api/chat/conversations  { sellerId, productId? } - buyer starts a chat
async function startConversation(req, res, next) {
  try {
    const buyerId = req.user._id;
    const { sellerId, productId } = req.body;

    let convo = await Conversation.findOne({ buyer: buyerId, seller: sellerId, product: productId || null });
    if (!convo) {
      convo = await Conversation.create({ buyer: buyerId, seller: sellerId, product: productId || undefined });
    }
    return res.status(201).json({ success: true, conversation: convo });
  } catch (err) {
    next(err);
  }
}

// GET /api/chat/conversations - list conversations for logged-in user (buyer or seller)
async function listConversations(req, res, next) {
  try {
    const userId = req.user._id;
    const convos = await Conversation.find({ $or: [{ buyer: userId }, { seller: userId }] })
      .sort({ lastMessageAt: -1 })
      .populate('buyer', 'name preferredLanguage')
      .populate('seller', 'name preferredLanguage')
      .populate('product', 'title images');
    return res.json({ success: true, conversations: convos });
  } catch (err) {
    next(err);
  }
}

// GET /api/chat/conversations/:id/messages?lang=
async function getMessages(req, res, next) {
  try {
    const { lang = req.user.preferredLanguage || 'en' } = req.query;
    const messages = await Message.find({ conversation: req.params.id }).sort({ createdAt: 1 });

    const localized = messages.map((m) => ({
      ...m.toObject(),
      displayText: m.type === 'voice' ? m.translations?.[lang] || m.transcript : m.translations?.[lang] || m.originalText,
    }));

    return res.json({ success: true, messages: localized });
  } catch (err) {
    next(err);
  }
}

module.exports = { startConversation, listConversations, getMessages };
