import { io } from 'socket.io-client';

// Derive the socket URL from the API URL by stripping the trailing /api,
// so we only need to configure VITE_API_URL (no separate socket env var).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');

let socket = null;

export function connectSocket() {
  if (socket?.connected) return socket;
  socket = io(SOCKET_URL, { transports: ['websocket'] });
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
