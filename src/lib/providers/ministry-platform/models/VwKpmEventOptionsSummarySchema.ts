import { z } from 'zod';

export const VwKpmEventOptionsSummarySchema = z.object({
  Read_Only_PK: z.number().int().nullable(),
  Event_ID: z.number().int(),
  Max_Qty: z.number().int().nullable(),
  Committed: z.number().int(),
  Remaining: z.number().int().nullable(),
  Awaiting: z.number().int().nullable(),
  Cancelled: z.number().int().nullable(),
  Product_Option_Price_ID: z.number().int(),
  Product_Option_Group_ID: z.number().int(),
});

export type VwKpmEventOptionsSummaryInput = z.infer<typeof VwKpmEventOptionsSummarySchema>;
