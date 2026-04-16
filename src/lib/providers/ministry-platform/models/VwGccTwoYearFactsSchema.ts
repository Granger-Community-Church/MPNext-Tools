import { z } from 'zod';

export const VwGccTwoYearFactsSchema = z.object({
  GCC_Metric_Name: z.string().max(31),
  Date_Accomplished: z.string().datetime().nullable(),
  Area: z.string().max(12),
  Sort_Order: z.number().int(),
});

export type VwGccTwoYearFactsInput = z.infer<typeof VwGccTwoYearFactsSchema>;
