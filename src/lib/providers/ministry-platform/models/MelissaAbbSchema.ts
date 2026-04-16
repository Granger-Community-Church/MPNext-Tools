import { z } from 'zod';

export const MelissaAbbSchema = z.object({
  ZIP: z.string().max(5).nullable(),
  CITY: z.string().max(28).nullable(),
  ABB: z.string().max(13).nullable(),
});

export type MelissaAbbInput = z.infer<typeof MelissaAbbSchema>;
