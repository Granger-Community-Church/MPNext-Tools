import { z } from 'zod';

export const CirclesSchema = z.object({
  Circle_ID: z.number().int(),
  Circle: z.string().max(50),
  Joined_Milestone: z.number().int().nullable(),
});

export type CirclesInput = z.infer<typeof CirclesSchema>;
