import { z } from 'zod';

export const AssetTypesSchema = z.object({
  Asset_Type_ID: z.number().int(),
  Asset_Type: z.string().max(50).nullable(),
});

export type AssetTypesInput = z.infer<typeof AssetTypesSchema>;
