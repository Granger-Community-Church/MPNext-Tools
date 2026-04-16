import { z } from 'zod';

export const VwGccUmcAnnualReportFactsSchema = z.object({
  Question: z.string().max(53),
  Date_Accomplished: z.string().datetime().nullable(),
  Report: z.string().max(21),
  Record_PK: z.number().int(),
  Sort_Order: z.number().int(),
});

export type VwGccUmcAnnualReportFactsInput = z.infer<typeof VwGccUmcAnnualReportFactsSchema>;
