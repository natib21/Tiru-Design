import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(9, 'Enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const verifyPhoneSchema = z.object({
  phone: z.string().min(9, 'Enter a valid phone number'),
  code: z.string().min(4, 'Enter the verification code'),
});

export const verifyEmailSchema = z.object({
  email: z.string().email('Enter a valid email'),
  code: z.string().min(4, 'Enter the verification code'),
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
