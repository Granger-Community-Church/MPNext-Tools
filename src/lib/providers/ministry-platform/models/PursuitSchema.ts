import { z } from 'zod';

export const PursuitSchema = z.object({
  Pursuit_ID: z.number().int(),
  Contact_ID: z.number().int(),
  Spouse: z.number().int().nullable(),
  Pursuit_Status_ID: z.number().int(),
  Household_ID: z.number().int().nullable(),
  Pursuit_Start: z.string().datetime(),
  Pursuit_End: z.string().datetime().nullable(),
  Staff_Assigned: z.number().int().nullable(),
  Pursuit_Notes: z.string().max(2000).nullable(),
});

export type PursuitInput = z.infer<typeof PursuitSchema>;
