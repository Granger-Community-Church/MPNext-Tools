import { z } from 'zod';

export const MelissaUnqSchema = z.object({
  ZIP: z.string().max(5).nullable(),
  NAME: z.string().max(28).nullable(),
});

export type MelissaUnqInput = z.infer<typeof MelissaUnqSchema>;
