import { z } from 'zod';

export const BibleTypesSchema = z.object({
  Bible_Type_ID: z.number().int(),
  Bible_Type: z.string().max(50),
});

export type BibleTypesInput = z.infer<typeof BibleTypesSchema>;
