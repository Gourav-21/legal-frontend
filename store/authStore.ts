import { create } from 'zustand';

interface UserProfile {
  email: string;
  name?: string | null;
  phone_no?: string | null;
}

interface AuthState {
  isLoggedIn: boolean;
  user: UserProfile | null;
  authLoading: boolean; // Added for loading state
  login: (userData: UserProfile) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  authLoading: true, // Assume loading initially until first checkAuth completes
  login: (userData) => set({ 
    isLoggedIn: true, 
    user: {
      email: userData.email,
      name: userData.name || null,
      phone_no: userData.phone_no || null,
    },
    authLoading: false, 
  }),
  logout: () => set({ 
    isLoggedIn: false, 
    user: null, 
    authLoading: false,
  }),
  checkAuth: async () => {
    set({ authLoading: true });
    try {
      const response = await fetch('/api/auth/me'); // No credentials needed for same-origin
      if (response.ok) {
        const userData = await response.json();
        set({ 
          isLoggedIn: true, 
          user: {
            email: userData.email,
            name: userData.name || null,
            phone_no: userData.phone_no || null,
          }, 
          authLoading: false 
        });
      } else {
        set({ isLoggedIn: false, user: null, authLoading: false });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      set({ isLoggedIn: false, user: null, authLoading: false });
    }
  },
}));

export default useAuthStore;
