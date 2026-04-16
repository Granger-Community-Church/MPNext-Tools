import { z } from 'zod';

export const CheckinSearchResultsTypesSchema = z.object({
  Checkin_Search_Results_Type_ID: z.number().int(),
  Search_Result_Type: z.string().max(50),
  Result_Description: z.string().max(254).nullable(),
});

export type CheckinSearchResultsTypesInput = z.infer<typeof CheckinSearchResultsTypesSchema>;
