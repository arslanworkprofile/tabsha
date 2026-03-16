import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API = '/api';

// ── Auth Store ────────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      setUser: (user) => set({ user }),

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { data } = await axios.post(`${API}/auth/login`, { email, password });
          set({ user: data, token: data.token, loading: false });
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          return { success: true };
        } catch (err) {
          set({ loading: false });
          return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
      },

      register: async (name, email, password) => {
        set({ loading: true });
        try {
          const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
          set({ user: data, token: data.token, loading: false });
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          return { success: true };
        } catch (err) {
          set({ loading: false });
          return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
      },

      logout: () => {
        set({ user: null, token: null });
        delete axios.defaults.headers.common['Authorization'];
      },

      initAuth: () => {
        const { token } = get();
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },
    }),
    {
      name: 'tabsha-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
      merge: (persistedState, currentState) => {
        const user = persistedState?.user;
        // Reject corrupt user objects that don't have a name
        const safeUser = user && typeof user === 'object' && user.name ? user : null;
        return {
          ...currentState,
          token: persistedState?.token || null,
          user: safeUser,
        };
      },
    }
  )
);

// ── Cart Store ────────────────────────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1, size = '', color = '', colorCode = '') => {
        const key = `${product._id}-${size}-${color}`;
        const items = Array.isArray(get().items) ? get().items : [];
        const existing = items.find(
          (i) => `${i._id}-${i.selectedSize}-${i.selectedColor}` === key
        );
        if (existing) {
          set({
            items: items.map((i) =>
              `${i._id}-${i.selectedSize}-${i.selectedColor}` === key
                ? { ...i, qty: i.qty + qty }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              { ...product, qty, selectedSize: size, selectedColor: color, selectedColorCode: colorCode },
            ],
          });
        }
      },

      removeItem: (key) =>
        set({
          items: (Array.isArray(get().items) ? get().items : []).filter(
            (i) => `${i._id}-${i.selectedSize}-${i.selectedColor}` !== key
          ),
        }),

      updateQty: (key, qty) => {
        if (qty < 1) return;
        set({
          items: (Array.isArray(get().items) ? get().items : []).map((i) =>
            `${i._id}-${i.selectedSize}-${i.selectedColor}` === key ? { ...i, qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'tabsha-cart',
      // Sanitize old/corrupt persisted state
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        items: Array.isArray(persistedState?.items) ? persistedState.items : [],
      }),
    }
  )
);

// ── Wishlist Store ────────────────────────────────────────────────────────────
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const items = Array.isArray(get().items) ? get().items : [];
        const exists = items.find((i) => i._id === product._id);
        if (exists) {
          set({ items: items.filter((i) => i._id !== product._id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      has: (id) => (Array.isArray(get().items) ? get().items : []).some((i) => i._id === id),
    }),
    {
      name: 'tabsha-wishlist',
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        items: Array.isArray(persistedState?.items) ? persistedState.items : [],
      }),
    }
  )
);
