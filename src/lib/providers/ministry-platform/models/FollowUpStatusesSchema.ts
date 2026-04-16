import { z } from 'zod';

export const FollowUpStatusesSchema = z.object({
  Follow_Up_Status_ID: z.number().int(),
  Follow_Up_Status: z.string().max(50),
});

export type FollowUpStatusesInput = z.infer<typeof FollowUpStatusesSchema>;
