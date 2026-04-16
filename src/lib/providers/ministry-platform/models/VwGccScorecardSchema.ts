import { z } from 'zod';

export const VwGccScorecardSchema = z.object({
  ID_Row: z.number().int().nullable(),
  Area: z.string().max(12),
  GCC_Metric_Name: z.string().max(50),
  Last_Year_Count: z.number().int().nullable(),
  YTD_Last_Year_Count: z.number().int().nullable(),
  Goal: z.number().int().nullable(),
  This_Year_Count: z.number().int().nullable(),
  This_Year_Q1_Count: z.number().int().nullable(),
  This_Year_Q2_Count: z.number().int().nullable(),
  This_Year_Q3_Count: z.number().int().nullable(),
  This_Year_Q4_Count: z.number().int().nullable(),
});

export type VwGccScorecardInput = z.infer<typeof VwGccScorecardSchema>;
