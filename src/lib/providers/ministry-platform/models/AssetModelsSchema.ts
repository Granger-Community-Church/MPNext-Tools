import { z } from 'zod';

export const AssetModelsSchema = z.object({
  Asset_Model_ID: z.number().int(),
  Model: z.string().max(50),
  Series: z.string().max(50).nullable(),
  Brand: z.number().int().nullable(),
  Type: z.number().int().nullable(),
});

export type AssetModelsInput = z.infer<typeof AssetModelsSchema>;
