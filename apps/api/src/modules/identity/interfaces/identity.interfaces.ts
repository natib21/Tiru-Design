export type UserStatus = 'UNVERIFIED' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export interface AuthenticatedUser {
  id: string;
  email: string;
  phoneNumber?: string | null;
  status: UserStatus;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface SessionRecord {
  id: string;
  userId: string;
  currentRefreshHash?: string | null;
  expiresAt: Date;
  revokedAt?: Date | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthAuditEvent {
  type: string;
  userId?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface PhoneVerificationProvider {
  sendOtp(phoneNumber: string, otp: string): Promise<void>;
}

export interface EmailVerificationProvider {
  sendVerificationEmail(email: string, token: string): Promise<void>;
}

export interface PasswordResetProvider {
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
}
