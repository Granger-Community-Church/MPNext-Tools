import { z } from 'zod';

export const VwGccEventExpectedSchema = z.object({
  Read_Only_PK: z.number().int().nullable(),
  Event_ID: z.number().int(),
  Participant_ID: z.number().int(),
  Group_Participant_ID: z.number().int().nullable(),
  Event_Participant_ID: z.number().int().nullable(),
});

export type VwGccEventExpectedInput = z.infer<typeof VwGccEventExpectedSchema>;
