import { z } from 'zod';

export const VwMpMqnaMwSummaryByCongregationSchema = z.object({
  Period_Congregation_ID: z.number().int().nullable(),
  Years_Since: z.string().max(4000),
  Fiscal_Year_Start: z.string().datetime(),
  Periods_Since: z.string().max(4000),
  Fiscal_Period_Start: z.string().datetime(),
  Fiscal_Period_Month: z.number().int().nullable(),
  Weeks_Since: z.string().max(4000),
  Ministry_Week_Start: z.string().datetime(),
  Ministry_Week_Type: z.string().max(50),
  Congregation_Name: z.string().max(50),
  Active_Adults: z.string().max(4000).nullable(),
  "Digital Attnd": z.string().max(4000).nullable(),
  Gen_Fund: z.string().max(4000).nullable(),
  GSM_Worship: z.string().max(4000).nullable(),
  "In-Person Attnd": z.string().max(4000).nullable(),
  "Kids Families": z.string().max(4000).nullable(),
  "Life Group %": z.string().max(4000).nullable(),
  New_Donors: z.string().max(4000).nullable(),
  "Student HH": z.string().max(4000).nullable(),
  Kids_Worship: z.string().max(4000).nullable(),
  Decisions: z.string().max(4000).nullable(),
  New_Guests: z.string().max(4000).nullable(),
  Baptisms: z.string().max(4000).nullable(),
  Life_Groups: z.string().max(4000).nullable(),
  Group_Leaders: z.string().max(4000).nullable(),
  Group_Members: z.string().max(4000).nullable(),
  Congregation_ID: z.number().int().nullable(),
});

export type VwMpMqnaMwSummaryByCongregationInput = z.infer<typeof VwMpMqnaMwSummaryByCongregationSchema>;
