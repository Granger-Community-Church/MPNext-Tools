import { z } from 'zod';

export const VwGccUmcAnnualReportSummarySchema = z.object({
  ID_Row: z.number().int().nullable(),
  Question: z.string().max(32),
  Report: z.string().max(21),
  Last_Year_Count: z.number().int().nullable(),
  Sort_Order: z.number().int(),
});

export type VwGccUmcAnnualReportSummaryInput = z.infer<typeof VwGccUmcAnnualReportSummarySchema>;
