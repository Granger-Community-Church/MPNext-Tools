import { z } from 'zod';

export const GccVwCoreMilestonesSchema = z.object({
  Participant_ID: z.number().int(),
  Contact_ID: z.number().int(),
  Core_101_Graduate: z.string().datetime().nullable(),
  Core_201_Graduate: z.string().datetime().nullable(),
  Core_301_Graduate: z.string().datetime().nullable(),
  Core_401_Graduate: z.string().datetime().nullable(),
  I_Am_Committed: z.string().datetime().nullable(),
  Membership: z.string().datetime().nullable(),
  SHAPE_Covenant: z.string().datetime().nullable(),
  Disciple: z.string().datetime().nullable(),
});

export type GccVwCoreMilestonesInput = z.infer<typeof GccVwCoreMilestonesSchema>;
