import { z } from 'zod';

export const MelissaMsaSchema = z.object({
  CODE: z.string().max(4).nullable(),
  TYP: z.string().max(4).nullable(),
  NAME: z.string().max(60).nullable(),
  CMSA: z.string().max(2).nullable(),
  POP: z.number().nullable(),
});

export type MelissaMsaInput = z.infer<typeof MelissaMsaSchema>;
