import { z } from 'zod';

export const PantryAssistanceSchema = z.object({
  Pantry_Assistance_ID: z.number().int(),
  Household_ID: z.number().int(),
  Contact_ID: z.number().int().nullable(),
  Assistance_Date: z.string().datetime().nullable(),
  Food_Boxes: z.number().int(),
  Care_Boxes: z.number().int(),
  Diaper_Boxes: z.number().int(),
  Assistance_Notes: z.string().max(2000).nullable(),
  Delivered_By: z.number().int().nullable(),
  Delivered: z.boolean().nullable(),
  Delivery_Notes: z.string().max(2000).nullable(),
});

export type PantryAssistanceInput = z.infer<typeof PantryAssistanceSchema>;
