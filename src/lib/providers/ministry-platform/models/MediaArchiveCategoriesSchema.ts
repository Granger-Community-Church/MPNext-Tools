import { z } from 'zod';

export const MediaArchiveCategoriesSchema = z.object({
  Media_Category_ID: z.number().int(),
  Category_Name: z.string().max(50),
});

export type MediaArchiveCategoriesInput = z.infer<typeof MediaArchiveCategoriesSchema>;
