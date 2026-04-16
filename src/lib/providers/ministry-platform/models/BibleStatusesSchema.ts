import { z } from 'zod';

export const BibleStatusesSchema = z.object({
  Bible_Status_ID: z.number().int(),
  Bible_Status: z.string().max(50),
});

export type BibleStatusesInput = z.infer<typeof BibleStatusesSchema>;
