function registerNotificationSocket(io, socket) {
  socket.on('notification:subscribe', ({ userId }) => {
    socket.join(`user:${userId}`);
  });
}

module.exports = registerNotificationSocket;
