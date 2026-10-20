import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().trim().min(3),
  password: z.string().min(8).max(128)
});

export type LoginDto = z.infer<typeof loginSchema>;
