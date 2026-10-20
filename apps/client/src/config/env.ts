import { z } from 'zod';

const defaultApiBaseUrl = 'http://localhost:4000/api';

const envSchema = z.object({
  VITE_API_BASE_URL: z
    .string()
    .trim()
    .min(1, 'VITE_API_BASE_URL is required')
    .url('VITE_API_BASE_URL must be a valid URL')
    .default(defaultApiBaseUrl),
});

export type AppEnv = z.infer<typeof envSchema>;

export function parseEnv(source: ImportMetaEnv): AppEnv {
  return envSchema.parse({
    VITE_API_BASE_URL: source.VITE_API_BASE_URL ?? defaultApiBaseUrl,
  });
}

export const env = parseEnv(import.meta.env);
