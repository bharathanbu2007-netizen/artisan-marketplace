const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { translateToAllLanguages } = require('../services/translationService');
const { transcribeAudio } = require('../services/speechService');

/**
 * Real-time buyer <-> seller chat with automatic translation.
 * Every message a sender emits is translated into every supported language
 * and stored once; each connected client is served the translation matching
 * their own preferredLanguage, so a Tamil manufacturer and a Hindi buyer can
 * message each other and each read replies in their own language.
 */
function registerChatSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      const payload = verifyToken(token);
      const user = await User.findById(payload.id);
      if (!user) return next(new Error('Invalid user'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = String(socket.user._id);
    socket.join(`user:${userId}`);

    socket.on('conversation:join', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    // payload: { conversationId, type: 'text'|'voice', text?, audioPath?, languageOverride? }
    socket.on('message:send', async (payload, ack) => {
      try {
        const convo = await Conversation.findById(payload.conversationId);
        if (!convo) return ack && ack({ success: false, message: 'Conversation not found' });

        const senderLanguage = payload.languageOverride || socket.user.preferredLanguage || 'en';

        let originalText = payload.text || '';
        let transcript;
        if (payload.type === 'voice' && payload.audioPath) {
          transcript = await transcribeAudio(payload.audioPath, senderLanguage);
          originalText = transcript;
        }

        const translations = await translateToAllLanguages(originalText, senderLanguage);

        const message = await Message.create({
          conversation: convo._id,
          sender: socket.user._id,
          type: payload.type || 'text',
          originalText,
          originalLanguage: senderLanguage,
          audioUrl: payload.audioPath,
          transcript,
          translations,
        });

        convo.lastMessageAt = new Date();
        convo.lastMessagePreview = originalText.slice(0, 80);
        await convo.save();

        io.to(`conversation:${convo._id}`).emit('message:new', {
          _id: message._id,
          conversation: convo._id,
          sender: socket.user._id,
          type: message.type,
          translations: message.translations,
          audioUrl: message.audioUrl,
          transcript: message.transcript,
          createdAt: message.createdAt,
        });

        ack && ack({ success: true, message });
      } catch (err) {
        console.error('[chatSocket] message:send error', err);
        ack && ack({ success: false, message: 'Failed to send message' });
      }
    });

    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit('typing', { userId, isTyping });
    });

    socket.on('disconnect', () => {
      socket.leave(`user:${userId}`);
    });
  });
}

module.exports = registerChatSocket;
