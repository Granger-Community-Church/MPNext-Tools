import { z } from 'zod';

export const VwGccMpHouseholdFactsSchema = z.object({
  Household_ID: z.number().int(),
  _First_Donation: z.string().datetime().nullable(),
  _Last_Donation: z.string().datetime().nullable(),
  Home_Phone: z.string().max(25).nullable(),
  Address_ID: z.number().int().nullable(),
  Driving_Distance: z.number().nullable(),
  Driving_Time: z.number().nullable(),
  Family_Size: z.number().int().nullable(),
  Minor_Children: z.number().int().nullable(),
  Children_Under_12: z.number().int().nullable(),
  Children_13_to_18: z.number().int().nullable(),
  Household_Source_ID: z.number().int().nullable(),
  Head_Age: z.number().int().nullable(),
  Bulk_Mail_Opt_Out: z.boolean(),
  Congregation_Name: z.string().max(50).nullable(),
});

export type VwGccMpHouseholdFactsInput = z.infer<typeof VwGccMpHouseholdFactsSchema>;
