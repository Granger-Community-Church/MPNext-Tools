import { z } from 'zod';

export const PledgeimportelkhartSchema = z.object({
  Donor_Last: z.string().max(255).nullable(),
  Donor_First: z.string().max(255).nullable(),
  Spouse_Last: z.string().max(255).nullable(),
  Spouse_First: z.string().max(255).nullable(),
  Organization: z.string().max(255).nullable(),
  Campus: z.string().max(255).nullable(),
  Phone: z.string().max(255).nullable(),
  "Street Address": z.string().max(255).nullable(),
  City: z.string().max(255).nullable(),
  State: z.string().max(255).nullable(),
  Zip: z.number().nullable(),
  "E-mail": z.string().max(255).nullable(),
  Birthday: z.string().datetime().nullable(),
  "Normal Gft": z.number().nullable(),
  "Expanded Gift": z.number().nullable(),
  "Total Yearly": z.number().nullable(),
  Kickstart: z.number().nullable(),
  "Total Gift": z.number().nullable(),
  "Next Step": z.string().max(255).nullable(),
  ContactMe: z.string().max(255).nullable(),
});

export type PledgeimportelkhartInput = z.infer<typeof PledgeimportelkhartSchema>;
