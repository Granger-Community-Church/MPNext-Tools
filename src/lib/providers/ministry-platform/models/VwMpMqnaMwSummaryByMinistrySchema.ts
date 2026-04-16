import { z } from 'zod';

export const VwMpMqnaMwSummaryByMinistrySchema = z.object({
  Period_Ministry_ID: z.number().int().nullable(),
  Years_Since: z.string().max(4000),
  Fiscal_Year_Start: z.string().datetime(),
  Periods_Since: z.string().max(4000),
  Fiscal_Period_Start: z.string().datetime(),
  Fiscal_Period_Month: z.number().int().nullable(),
  Weeks_Since: z.string().max(4000),
  Ministry_Week_Start: z.string().datetime(),
  Ministry_Week_Type: z.string().max(50),
  Ministry_Name: z.string().max(50),
  Life_Groups: z.string().max(4000).nullable(),
  Group_Members: z.string().max(4000).nullable(),
  Ministry_ID: z.number().int().nullable(),
});

export type VwMpMqnaMwSummaryByMinistryInput = z.infer<typeof VwMpMqnaMwSummaryByMinistrySchema>;
