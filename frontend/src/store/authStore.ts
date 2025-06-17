'use client';
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface UserProfile {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  login: async (credentials) => {
    set({
      user: { id: '1', email: credentials.email, name: 'User' },
      isAuthenticated: true,
      token: 'dummy-token',
    });
  },
  logout: () => set({ user: null, isAuthenticated: false, token: null }),
  register: async (userData) => {
    set({
      user: { id: '1', email: userData.email, name: userData.name },
      isAuthenticated: true,
      token: 'dummy-token',
    });
  },
  updateProfile: async (profile) =>
    set((state) => ({ user: state.user ? { ...state.user, ...profile } : null })),
}));
