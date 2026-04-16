import { z } from 'zod';

export const ZrewardsdataSchema = z.object({
  INDIVIDUAL_last_name: z.string().max(255).nullable(),
  INDIVIDUAL_first_name: z.string().max(255).nullable(),
  INDIVIDUAL_goes_by: z.string().max(255).nullable(),
  INDIVIDUAL_date_of_birth: z.string().datetime().nullable(),
  Preferred_Email: z.string().max(255).nullable(),
  Preferred_Phone: z.string().max(255).nullable(),
  Contact_ID: z.number().int().nullable(),
});

export type ZrewardsdataInput = z.infer<typeof ZrewardsdataSchema>;
