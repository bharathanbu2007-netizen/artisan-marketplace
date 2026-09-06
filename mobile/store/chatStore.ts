import { create } from 'zustand';
import api from '../services/api';
import { getSocket } from '../services/socket';

type Message = {
  _id?: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text?: string;
  type: string;
  createdAt?: string;
};

type ChatState = {
  conversations: any[];
  messagesByConversation: Record<string, Message[]>;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (payload: Message, onError?: (err: string) => void) => void;
  receiveMessage: (message: Message) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messagesByConversation: {},

  fetchConversations: async () => {
    const { data } = await api.get('/conversations');
    set({ conversations: data.data.conversations });
  },

  fetchMessages: async (conversationId) => {
    const { data } = await api.get(`/conversations/${conversationId}/messages`);
    set((state) => ({
      messagesByConversation: { ...state.messagesByConversation, [conversationId]: data.data.messages },
    }));
  },

  sendMessage: (payload: Message, onError?: (err: string) => void) => {
    const socket = getSocket();
    socket?.emit('message:send', payload, (ack: { success: boolean; message?: Message; error?: string }) => {
      if (ack?.success && ack.message) {
        get().receiveMessage(ack.message);
      } else {
        console.error('[chatStore] sendMessage failed:', ack?.error);
        onError?.(ack?.error || 'Message failed to send');
      }
    });
  },

  receiveMessage: (message) => {
    set((state) => {
      const existing = state.messagesByConversation[message.conversationId] || [];
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [message.conversationId]: [...existing, message],
        },
      };
    });
  },
}));
