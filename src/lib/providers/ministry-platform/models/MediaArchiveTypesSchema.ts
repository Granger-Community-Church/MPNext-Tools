import { z } from 'zod';

export const MediaArchiveTypesSchema = z.object({
  Media_Type_ID: z.number().int(),
  Media_Type: z.string().max(50).nullable(),
});

export type MediaArchiveTypesInput = z.infer<typeof MediaArchiveTypesSchema>;
