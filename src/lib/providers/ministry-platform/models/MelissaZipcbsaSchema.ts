import { z } from 'zod';

export const MelissaZipcbsaSchema = z.object({
  ZIP: z.string().max(5).nullable(),
  CBSA: z.string().max(5).nullable(),
  DIV: z.string().max(5).nullable(),
});

export type MelissaZipcbsaInput = z.infer<typeof MelissaZipcbsaSchema>;
