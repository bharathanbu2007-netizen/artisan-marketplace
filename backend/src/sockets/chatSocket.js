const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

function registerChatSocket(io, socket) {
  // socket:message:send { conversationId, senderId, receiverId, type, text }
  socket.on('message:send', async (payload, ack) => {
    try {
      const { conversationId, senderId, receiverId, type = 'text', text, attachments, productId } = payload;

      const message = await Message.create({
        conversationId,
        senderId,
        receiverId,
        type,
        text,
        attachments,
        productId,
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text || `[${type}]`,
        lastMessageAt: new Date(),
      });

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
