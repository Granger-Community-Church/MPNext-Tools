import { z } from 'zod';

export const AudienceAudienceFiltersSchema = z.object({
  Audience_Audience_Filter_ID: z.number().int(),
  Audience_ID: z.number().int(),
  Filter_ID: z.number().int(),
  Operator_ID: z.number().int(),
  Filter_Parameter: z.string().max(64).nullable(),
  Filter_Notes: z.string().max(254).nullable(),
});

export type AudienceAudienceFiltersInput = z.infer<typeof AudienceAudienceFiltersSchema>;
