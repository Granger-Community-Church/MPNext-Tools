import { z } from 'zod';

export const VwGccMpDonorsSchema = z.object({
  Contact_ID: z.number().int(),
  Donor_ID: z.number().int(),
  Donation_Frequency: z.string().max(50).nullable(),
  Donation_Level: z.string().max(50).nullable(),
  _First_Donation_Date: z.string().datetime().nullable(),
  _Last_Donation_Date: z.string().datetime().nullable(),
});

export type VwGccMpDonorsInput = z.infer<typeof VwGccMpDonorsSchema>;
