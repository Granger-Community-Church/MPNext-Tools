import { z } from 'zod';

export const VwGccMinistryTenureMonthsSchema = z.object({
  Ministry_ID: z.number().int(),
  Participant_ID: z.number().int(),
  Months_Serving: z.number().int().nullable(),
});

export type VwGccMinistryTenureMonthsInput = z.infer<typeof VwGccMinistryTenureMonthsSchema>;
