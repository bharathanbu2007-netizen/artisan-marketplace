const Notification = require('../models/Notification');

let ioInstance = null;

function attachIo(io) {
  ioInstance = io;
}

/**
 * Persist a notification and push it in real time to the target user's room
 * (rooms are joined by userId in sockets/index.js). Also the natural place
 * to fan out to Expo/FCM push notifications for background delivery.
 */
async function notifyUser(userId, { type, title, body, data = {} }) {
  const notification = await Notification.create({ userId, type, title, body, data });

  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit('notification:new', notification);
  }

  // TODO: integrate Expo push / FCM here for background/offline delivery.
  return notification;
}

module.exports = { attachIo, notifyUser };
