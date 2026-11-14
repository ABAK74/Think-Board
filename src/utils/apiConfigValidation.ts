import { z } from 'zod';
import { DEFAULT_API_BASE_URL } from '../services/api';

export const apiConfigSchema = z.object({
  baseUrl: z.string().trim()
    .transform((value) => value.replace(/\/+$/, '') || DEFAULT_API_BASE_URL)
    .pipe(z.url({
      protocol: /^https?$/,
      error: 'Please enter a valid HTTP or HTTPS URL.',
    })),
  useMockFallback: z.boolean(),
});
