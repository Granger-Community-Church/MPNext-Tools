import { z } from 'zod';

export const PledgeimportgrangerSchema = z.object({
  Donor_Last: z.string().max(255).nullable(),
  Donor_First: z.string().max(255).nullable(),
  Spouse_Last: z.string().max(255).nullable(),
  Spouse_First: z.string().max(255).nullable(),
  Organization: z.string().max(255).nullable(),
  Campus: z.string().max(255).nullable(),
  Phone: z.string().max(255).nullable(),
  Street_Address: z.string().max(255).nullable(),
  City: z.string().max(255).nullable(),
  State: z.string().max(255).nullable(),
  Zip: z.number().nullable(),
  Email: z.string().max(255).nullable(),
  Birthday: z.string().datetime().nullable(),
  Normal_Gft: z.number().nullable(),
  Expanded_Gift: z.number().nullable(),
  Total_Yearly: z.number().nullable(),
  Kickstart: z.number().nullable(),
  Total_Pledge: z.number().nullable(),
  Next_Step: z.string().max(255).nullable(),
  ContactMe: z.string().max(255).nullable(),
  Pledge_Campaign_ID: z.number().nullable(),
  Pledge_Status_ID: z.number().nullable(),
  Installments_Planned: z.number().nullable(),
  Installments_Per_Year: z.number().nullable(),
  First_Installment_Date: z.string().datetime().nullable(),
});

export type PledgeimportgrangerInput = z.infer<typeof PledgeimportgrangerSchema>;
