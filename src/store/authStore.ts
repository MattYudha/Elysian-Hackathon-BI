import { create } from 'zustand';
import { User } from '@/lib/sdk/schemas/auth.schema';

interface AuthState {
    user: Pick<User, 'name' | 'email' | 'avatar'> | null;
    isAuthenticated: boolean;
    isLoadingSession: boolean;
    login: (user: Pick<User, 'name' | 'email' | 'avatar'>) => void;
    logout: () => void;
    setLoadingSession: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoadingSession: true, // Default true while checking HttpOnly cookie via /me
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    setLoadingSession: (isLoadingSession) => set({ isLoadingSession }),
}));
