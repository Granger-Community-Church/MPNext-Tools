import { z } from 'zod';

export const DpSelectionsSchema = z.object({
  Selection_ID: z.number().int(),
  Selection_Name: z.string().max(50),
  Page_ID: z.number().int(),
  User_ID: z.number().int(),
  Sub_Page_ID: z.number().int().nullable(),
  Expiration_Date: z.string().datetime().nullable(),
  Selection_Kind: z.unknown(),
  Parent_Record_ID: z.number().int().nullable(),
});

export type DpSelectionsInput = z.infer<typeof DpSelectionsSchema>;
