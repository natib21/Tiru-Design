import { create } from 'zustand';

export interface TokenStorage {
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  removeRefreshToken(): void;
}

export const localStorageTokenStorage: TokenStorage = {
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('tirudesign_refresh_token');
    } catch {
      return null;
    }
  },
  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('tirudesign_refresh_token', token);
    } catch {
      // storage unavailable or full
    }
  },
  removeRefreshToken(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('tirudesign_refresh_token');
    } catch {
      // storage unavailable
    }
  },
};

let currentTokenStorage: TokenStorage = localStorageTokenStorage;

export function setTokenStorage(storage: TokenStorage): void {
  currentTokenStorage = storage;
}

export function getTokenStorage(): TokenStorage {
  return currentTokenStorage;
}

export interface AuthUser {
  id: string;
  email: string;
  phoneNumber?: string | null;
  name?: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  status?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isRestoring: boolean;
  isRestored: boolean;
  setTokens: (tokens: { accessToken: string; refreshToken?: string | null }) => void;
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  setIsRestoring: (isRestoring: boolean) => void;
  setIsRestored: (isRestored: boolean) => void;
  clearSession: () => void;
}

const initialRefreshToken = currentTokenStorage.getRefreshToken();

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: initialRefreshToken,
  user: null,
  isRestoring: Boolean(initialRefreshToken),
  isRestored: !initialRefreshToken,
  setTokens: ({ accessToken, refreshToken }) => {
    if (refreshToken !== undefined) {
      if (refreshToken) {
        currentTokenStorage.setRefreshToken(refreshToken);
      } else {
        currentTokenStorage.removeRefreshToken();
      }
      set({ accessToken, refreshToken: refreshToken ?? null });
    } else {
      set({ accessToken });
    }
  },
  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setIsRestoring: (isRestoring) => set({ isRestoring }),
  setIsRestored: (isRestored) => set({ isRestored }),
  clearSession: () => {
    currentTokenStorage.removeRefreshToken();
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isRestoring: false,
      isRestored: true,
    });
  },
}));
