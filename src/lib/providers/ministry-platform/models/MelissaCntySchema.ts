import { z } from 'zod';

export const MelissaCntySchema = z.object({
  FIPS: z.string().max(5).nullable(),
  NAME: z.string().max(25).nullable(),
  STATE: z.string().max(2).nullable(),
  T_Z: z.string().max(2).nullable(),
  CNTY_TYPE: z.string().max(1).nullable(),
  COUNTYSEAT: z.string().max(28).nullable(),
  NAME_TYPE: z.string().max(1).nullable(),
  ELEVATION: z.string().max(5).nullable(),
  PERNS_HOUS: z.number().nullable(),
  POPULATION: z.number().nullable(),
  AREA_SQ_MI: z.number().nullable(),
  HOUSEHOLDS: z.number().nullable(),
  WHITE: z.number().nullable(),
  BLACK: z.number().nullable(),
  HISPANIC: z.number().nullable(),
  INCOM_HHLD: z.number().nullable(),
  HOUSE_VAL: z.number().nullable(),
});

export type MelissaCntyInput = z.infer<typeof MelissaCntySchema>;
