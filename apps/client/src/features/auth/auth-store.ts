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

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (tokens: { accessToken: string; refreshToken?: string | null }) => void;
  setAccessToken: (accessToken: string | null) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: currentTokenStorage.getRefreshToken(),
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
  setAccessToken: (accessToken) => set({ accessToken }),
  clearSession: () => {
    currentTokenStorage.removeRefreshToken();
    set({ accessToken: null, refreshToken: null });
  },
}));
