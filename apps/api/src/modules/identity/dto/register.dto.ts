import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().email(),
  phoneNumber: z.string().trim().min(8),
  password: z.string().min(8).max(128)
});

export type RegisterDto = z.infer<typeof registerSchema>;
