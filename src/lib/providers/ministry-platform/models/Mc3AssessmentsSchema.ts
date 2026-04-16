import { z } from 'zod';

export const Mc3AssessmentsSchema = z.object({
  MC3_Assessment_ID: z.number().int(),
  Participant_ID: z.number().int(),
  Assessment_Date: z.string().datetime(),
  Housing_Type_ID: z.number().int().nullable(),
  Years_at_Current_Residence: z.number().int(),
  Landlord_Contact_Information: z.string().max(2000).nullable(),
});

export type Mc3AssessmentsInput = z.infer<typeof Mc3AssessmentsSchema>;
