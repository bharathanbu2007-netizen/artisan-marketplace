const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const initSockets = require('./sockets');

async function start() {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [env.CLIENT_URL, env.MOBILE_URL, 'http://localhost:19006', 'http://localhost:8081'],
      credentials: true,
    },
  });

  app.set('io', io);
  initSockets(io);

  server.listen(env.PORT, () => {
    console.log(`[server] AI Artisan Marketplace API running on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

start();
