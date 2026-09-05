import { create } from 'zustand';
import api from '../services/api';

type CartItem = { productId: string; quantity: number; product?: any };

type CartState = {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  total: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      set({ items: data.data.cart.items || [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    const { data } = await api.post('/cart', { productId, quantity });
    set({ items: data.data.cart.items || [] });
  },

  removeFromCart: async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    set({ items: data.data.cart.items || [] });
  },

  clearCart: async () => {
    await api.delete('/cart');
    set({ items: [] });
  },

  total: () => {
    return get().items.reduce((sum, item) => {
      const price = item.product?.pricing?.manufacturerPrice || 0;
      return sum + price * item.quantity;
    }, 0);
  },
}));
