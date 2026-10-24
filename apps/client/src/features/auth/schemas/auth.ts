import { z } from 'zod';

export const ethPhoneRegex = /^[79]\d{8}$/;

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const signupFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(ethPhoneRegex, 'Please enter a valid Ethiopian phone number (9XXXXXXXX or 7XXXXXXXX)'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must be at least 8 characters and include a number'),
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must accept the Terms of Service to continue',
    }),
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;

// Legacy schema re-exports for backward compatibility if imported elsewhere
export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
  displayName: z.string().optional(),
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
