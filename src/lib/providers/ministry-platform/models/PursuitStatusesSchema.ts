import { z } from 'zod';

export const PursuitStatusesSchema = z.object({
  Pursuit_Status_ID: z.number().int(),
  Pursuit_Status: z.string().max(50),
});

export type PursuitStatusesInput = z.infer<typeof PursuitStatusesSchema>;
