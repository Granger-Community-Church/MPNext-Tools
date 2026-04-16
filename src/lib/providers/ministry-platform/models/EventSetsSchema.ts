import { z } from 'zod';

export const EventSetsSchema = z.object({
  Event_Set_ID: z.number().int(),
  Event_Set: z.string().max(75),
  Description: z.string().max(255).nullable(),
  Active: z.boolean().nullable(),
});

export type EventSetsInput = z.infer<typeof EventSetsSchema>;
