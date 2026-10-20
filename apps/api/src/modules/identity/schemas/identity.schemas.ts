import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().email(),
  phoneNumber: z.string().trim().min(8),
  password: z.string().min(8).max(128)
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(3),
  password: z.string().min(8).max(128)
});

export const verifyPhoneSchema = z.object({
  phoneNumber: z.string().trim().min(8),
  otp: z.string().trim().min(4).max(8)
});

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(8)
});

export const resendOtpSchema = z.object({
  phoneNumber: z.string().trim().min(8)
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(8),
  password: z.string().min(8).max(128)
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(128),
  newPassword: z.string().min(8).max(128)
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(8)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
