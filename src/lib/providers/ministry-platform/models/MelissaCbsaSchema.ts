import { z } from 'zod';

export const MelissaCbsaSchema = z.object({
  CODE: z.string().max(5).nullable(),
  TYPE: z.string().max(4).nullable(),
  TITLE: z.string().max(50).nullable(),
  LEVEL: z.string().max(29).nullable(),
  STATUS: z.string().max(1).nullable(),
});

export type MelissaCbsaInput = z.infer<typeof MelissaCbsaSchema>;
