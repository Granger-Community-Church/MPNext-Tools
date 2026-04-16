import { z } from 'zod';

export const EventSetEventsSchema = z.object({
  Event_Set_Event_ID: z.number().int(),
  Event_Set_ID: z.number().int(),
  Event_ID: z.number().int(),
  Order: z.number().int(),
  Days_Offset: z.number().int(),
});

export type EventSetEventsInput = z.infer<typeof EventSetEventsSchema>;
