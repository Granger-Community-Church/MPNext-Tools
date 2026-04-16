import { z } from 'zod';

export const MelissaZipSchema = z.object({
  ZIP: z.string().max(5).nullable(),
  STATE: z.string().max(2).nullable(),
  CITY: z.string().max(28).nullable(),
  TYP: z.string().max(1).nullable(),
  FIPS: z.string().max(5).nullable(),
  LAT: z.string().max(7).nullable(),
  LNG: z.string().max(8).nullable(),
  A_C: z.string().max(3).nullable(),
  FINANCE: z.string().max(6).nullable(),
  LL: z.string().max(1).nullable(),
  FAC: z.string().max(1).nullable(),
  MSA: z.string().max(4).nullable(),
  PMSA: z.string().max(4).nullable(),
  FILLER: z.string().max(3).nullable(),
});

export type MelissaZipInput = z.infer<typeof MelissaZipSchema>;
