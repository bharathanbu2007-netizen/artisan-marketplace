const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

function registerChatSocket(io, socket) {
  // socket:message:send { conversationId, senderId, type, text }
  // receiverId is intentionally NOT trusted from the client — it's resolved
  // here from the conversation's participants, the same way the REST
  // fallback (conversationController.sendMessage) already does it.
  socket.on('message:send', async (payload, ack) => {
    try {
      const { conversationId, senderId, type = 'text', text, attachments, productId } = payload;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) throw new Error('Conversation not found');

      const receiverId = conversation.participants.find((p) => p.toString() !== senderId.toString());
      if (!receiverId) throw new Error('Could not determine message recipient');

      const message = await Message.create({
        conversationId,
        senderId,
        receiverId,
        type,
        text,
        attachments,
        productId,
      });

      conversation.lastMessage = text || `[${type}]`;
      conversation.lastMessageAt = new Date();
      await conversation.save();

      io.to(`user:${receiverId}`).emit('message:new', message);
      io.to(`user:${senderId}`).emit('message:new', message);
      ack?.({ success: true, message });
    } catch (err) {
      ack?.({ success: false, error: err.message });
    }
  });

  socket.on('message:read', async ({ conversationId, userId }) => {
    await Message.updateMany({ conversationId, receiverId: userId, read: false }, { read: true });
    io.to(`conversation:${conversationId}`).emit('message:read', { conversationId, userId });
  });

  socket.on('typing:start', ({ conversationId, userId, receiverId }) => {
    io.to(`user:${receiverId}`).emit('typing:start', { conversationId, userId });
  });

  socket.on('typing:stop', ({ conversationId, userId, receiverId }) => {
    io.to(`user:${receiverId}`).emit('typing:stop', { conversationId, userId });
  });
}

module.exports = registerChatSocket;
