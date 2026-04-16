import { z } from 'zod';

export const AssistanceCategoriesSchema = z.object({
  Assistance_Category_ID: z.number().int(),
  Assistance_Category: z.string().max(50),
  Review_Months: z.number().int().nullable(),
  Description: z.string().max(500).nullable(),
});

export type AssistanceCategoriesInput = z.infer<typeof AssistanceCategoriesSchema>;
