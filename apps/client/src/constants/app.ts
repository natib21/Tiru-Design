export const APP_NAME = 'TiruDesign';

export const AUTH_ENDPOINTS = {
  session: '/api/v1/auth/session',
  login: '/api/v1/auth/login',
  signup: '/api/v1/auth/signup',
  logout: '/api/v1/auth/logout',
  verifyPhone: '/api/v1/auth/verify-phone',
  verifyEmail: '/api/v1/auth/verify-email',
  forgotPassword: '/api/v1/auth/forgot-password',
  resetPassword: '/api/v1/auth/reset-password',
  google: '/api/auth/google',
  googleCallback: '/api/auth/google/callback',
} as const;

export const API_TIMEOUT_MS = 15_000;
