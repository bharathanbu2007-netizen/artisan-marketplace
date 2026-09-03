import { create } from 'zustand';
import * as authService from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  hydrate: async () => {
    const user = await authService.getStoredUser();
    set({ user, isLoading: false });
  },

  loginSuccess: (user) => set({ user }),

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },
}));
