import { z } from 'zod';

export const Mc3EventMetricsSchema = z.object({
  Event_Start_Date: z.string().datetime().nullable(),
  Event_Title: z.string().max(255).nullable(),
  Breakfast_Plates: z.number().int().nullable(),
  Lunch_Plates: z.number().int().nullable(),
  Headcount: z.number().int().nullable(),
});

export type Mc3EventMetricsInput = z.infer<typeof Mc3EventMetricsSchema>;
