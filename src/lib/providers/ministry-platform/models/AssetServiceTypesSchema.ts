import { z } from 'zod';

export const AssetServiceTypesSchema = z.object({
  Service_Type_ID: z.number().int(),
  Service_Type: z.string().max(50),
});

export type AssetServiceTypesInput = z.infer<typeof AssetServiceTypesSchema>;
