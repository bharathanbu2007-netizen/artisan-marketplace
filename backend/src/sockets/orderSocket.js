function registerOrderSocket(io, socket) {
  socket.on('order:subscribe', ({ orderId }) => {
    socket.join(`order:${orderId}`);
  });

  socket.on('order:unsubscribe', ({ orderId }) => {
    socket.leave(`order:${orderId}`);
  });

  // Order lifecycle events (order:created / order:updated / order:cancelled)
  // are emitted from orderController.js via req.app.get('io').emit(...)
  // after the database write succeeds — sockets here just manage room membership.
}

module.exports = registerOrderSocket;
