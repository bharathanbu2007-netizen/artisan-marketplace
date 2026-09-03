const { Server } = require('socket.io');

function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
    },
  });
  return io;
}

module.exports = createSocketServer;
