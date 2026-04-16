import { z } from 'zod';

export const VwGccMinistryTenureSchema = z.object({
  Group_Participant_ID: z.number().int(),
  Display_Name: z.string().max(125).nullable(),
  Nickname: z.string().max(50).nullable(),
  Ministry_ID: z.number().int(),
  Current_Role_Title: z.string().max(50),
  Current_Role_Start: z.string().datetime(),
  Ministry_Name: z.string().max(50),
  Earliest_Service: z.string().datetime(),
  Service_Months: z.number().int().nullable(),
  Service_Years: z.number().int().nullable(),
  Is_Uninterrupted: z.number().int(),
  Gap_Months: z.number().int(),
  Participant_ID: z.number().int(),
  Contact_ID: z.number().int(),
});

export type VwGccMinistryTenureInput = z.infer<typeof VwGccMinistryTenureSchema>;
