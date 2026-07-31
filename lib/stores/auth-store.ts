import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@life-for-all/types';

interface AuthState {
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    isVerified: boolean;
    isPhoneVerified?: boolean;
    // Extended profile fields from registration
    age?: string;
    gender?: string;
    fathersName?: string;
    address?: string;
    state?: string;
    district?: string;
    pincode?: string;
  } | null;
  isAuthenticated: boolean;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('accessToken', token);
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

