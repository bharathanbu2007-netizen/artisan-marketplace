const registerChatSocket = require('./chatSocket');
const registerOrderSocket = require('./orderSocket');
const registerNotificationSocket = require('./notificationSocket');
const { attachIo } = require('../services/notificationService');

function initSockets(io) {
  attachIo(io);

  io.on('connection', (socket) => {
    console.log(`[socket] connected: ${socket.id}`);

    // Client emits this right after connecting so we can route
    // user:online / notifications / DMs to their personal room.
    socket.on('user:online', ({ userId }) => {
      socket.data.userId = userId;
      socket.join(`user:${userId}`);
      io.emit('user:online', { userId });
    });

    registerChatSocket(io, socket);
    registerOrderSocket(io, socket);
    registerNotificationSocket(io, socket);

    socket.on('disconnect', () => {
      if (socket.data.userId) {
        io.emit('user:offline', { userId: socket.data.userId });
      }
      console.log(`[socket] disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSockets;
