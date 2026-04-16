import { z } from 'zod';

export const HousingTypesSchema = z.object({
  Housing_Type_ID: z.number().int(),
  Housing_Type: z.string().max(50),
});

export type HousingTypesInput = z.infer<typeof HousingTypesSchema>;
