import { useEffect, useRef } from 'react';
import { getSocket, disconnectSocket } from '../services/socket';

export function useSocket(onMessage, conversationId) {
  const socketRef = useRef(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const socket = await getSocket();
      if (!active) return;
      socketRef.current = socket;

      if (conversationId) socket.emit('conversation:join', conversationId);
      if (onMessage) socket.on('message:new', onMessage);
    })();

    return () => {
      active = false;
      if (socketRef.current && onMessage) socketRef.current.off('message:new', onMessage);
    };
  }, [conversationId]);

  return socketRef;
}
