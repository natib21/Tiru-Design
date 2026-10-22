import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z
    .string()
    .min(1, 'VITE_API_URL is required')
    .url('VITE_API_URL must be a valid URL'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse({
    VITE_API_URL: import.meta.env.VITE_API_URL,
  });

  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    throw new Error(`[FATAL] Configuration validation error: ${issues}`);
  }

  return result.data;
}

export const env = loadEnv();
