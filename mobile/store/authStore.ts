import { create } from 'zustand';
import * as authService from '../services/auth';

type User = { id: string; name: string; email: string; role: 'buyer' | 'artisan' | 'admin' };

type AuthState = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Parameters<typeof authService.register>[0]) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  login: async (email, password) => {
    const data = await authService.login(email, password);
    set({ user: data.user });
  },

  register: async (payload) => {
    const data = await authService.register(payload);
    set({ user: data.user });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  hydrate: async () => {
    const user = await authService.getStoredUser();
    set({ user, isLoading: false });
  },
}));
