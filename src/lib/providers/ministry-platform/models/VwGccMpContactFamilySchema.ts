import { z } from 'zod';

export const VwGccMpContactFamilySchema = z.object({
  Contact_ID: z.number().int(),
  Spouse_Contact_ID: z.number().int().nullable(),
  Spouse_Nickname: z.string().max(50).nullable(),
  Spouse_First_Name: z.string().max(50).nullable(),
  Spouse_Last_Name: z.string().max(50).nullable(),
  Spouse_Display_Name: z.string().max(125).nullable(),
  Spouse_Email_Address: z.string().email().max(254).nullable(),
  Spouse_Mobile_Phone: z.string().max(25).nullable(),
});

export type VwGccMpContactFamilyInput = z.infer<typeof VwGccMpContactFamilySchema>;
