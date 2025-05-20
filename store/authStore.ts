import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userEmail: null,
  login: (email) => set({ isLoggedIn: true, userEmail: email }),
  logout: () => set({ isLoggedIn: false, userEmail: null }),
  checkAuth: async () => {
    try {
    const response = await fetch('/api/auth/me', {
    });
      if (response.ok) {
        const user = await response.json();
        set({ isLoggedIn: true, userEmail: user.email });
      } else {
        set({ isLoggedIn: false, userEmail: null });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      set({ isLoggedIn: false, userEmail: null });
    }
  },
}));

export default useAuthStore;
