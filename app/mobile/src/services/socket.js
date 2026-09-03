import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL } from '../utils/constants';

let socketInstance = null;

export async function getSocket() {
  if (socketInstance?.connected) return socketInstance;
  const token = await AsyncStorage.getItem('auth_token');
  socketInstance = io(SOCKET_URL, { auth: { token }, transports: ['websocket'] });
  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
