import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../constants/theme';

let socket: Socket | null = null;

export function connectSocket(userId: string): Socket {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, { transports: ['websocket'] });
  socket.on('connect', () => {
    socket?.emit('user:online', { userId });
    socket?.emit('notification:subscribe', { userId });
  });
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
