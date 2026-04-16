import { z } from 'zod';

export const MelissaZipcntySchema = z.object({
  ZIP: z.string().max(5).nullable(),
  FIPS: z.string().max(5).nullable(),
  PERCENTAGE: z.number().nullable(),
  COUNT: z.number().nullable(),
});

export type MelissaZipcntyInput = z.infer<typeof MelissaZipcntySchema>;
