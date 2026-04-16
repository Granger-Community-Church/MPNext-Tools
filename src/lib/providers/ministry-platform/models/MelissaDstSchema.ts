import { z } from 'zod';

export const MelissaDstSchema = z.object({
  ZIP: z.string().max(5).nullable(),
  RES: z.number().nullable(),
  RES_POB: z.number().nullable(),
  BUS: z.number().nullable(),
  BUS_POB: z.number().nullable(),
  GRP_DEL: z.number().nullable(),
  GEN_DEL: z.number().nullable(),
});

export type MelissaDstInput = z.infer<typeof MelissaDstSchema>;
