import { z } from 'zod';

export const ContactLogTypesSchema = z.object({
  Contact_Log_Type_ID: z.number().int(),
  Contact_Log_Type: z.string().max(50),
  Description: z.string().max(500).nullable(),
  User_Group_ID: z.number().int().nullable(),
});

export type ContactLogTypesInput = z.infer<typeof ContactLogTypesSchema>;
