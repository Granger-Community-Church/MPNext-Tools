import { z } from 'zod';

export const HouseholdsSchema = z.object({
  Household_ID: z.number().int(),
  Household_Name: z.string().max(75),
  Address_ID: z.number().int().nullable(),
  Home_Phone: z.string().nullable(),
  Congregation_ID: z.number().int().nullable(),
  Care_Person: z.number().int().nullable(),
  Household_Source_ID: z.number().int().nullable(),
  Family_Call_Number: z.number().int().nullable(),
  Authorized_Pickup_Note: z.string().max(100).nullable(),
  Home_Phone_Unlisted: z.boolean(),
  Home_Address_Unlisted: z.boolean(),
  Bulk_Mail_Opt_Out: z.boolean(),
  MC3_Delivery_Start: z.string().datetime().nullable(),
  MC3_Delivery_End: z.string().datetime().nullable(),
  Last_Assistance_Review: z.string().datetime().nullable(),
  Assistance_Category_ID: z.number().int().nullable(),
  _First_Donation: z.string().datetime().nullable(),
  _Last_Donation: z.string().datetime().nullable(),
  _Last_Activity: z.string().datetime().nullable(),
  Alternate_Mailing_Address: z.number().int().nullable(),
  Season_Start: z.string().datetime().nullable(),
  Season_End: z.string().datetime().nullable(),
  Repeats_Annually: z.boolean(),
  Driving_Distance: z.number().nullable(),
  Driving_Time: z.number().nullable(),
  PCO_Connect_Mode: z.number().int().nullable(),
  _First_General_Fund_Donation: z.string().datetime().nullable(),
});

export type HouseholdsInput = z.infer<typeof HouseholdsSchema>;
