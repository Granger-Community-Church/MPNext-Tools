import { z } from 'zod';

export const VwGccSpiritualJourneyMilestonesSchema = z.object({
  Participant_ID: z.number().int(),
  Contact_ID: z.number().int(),
  Baptism: z.string().datetime().nullable(),
  Child_Dedication: z.string().datetime().nullable(),
  Smooth_Stone_Award: z.string().datetime().nullable(),
});

export type VwGccSpiritualJourneyMilestonesInput = z.infer<typeof VwGccSpiritualJourneyMilestonesSchema>;
