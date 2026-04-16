import { z } from 'zod';

export const AssetVendorsSchema = z.object({
  Asset_Vendor_ID: z.number().int(),
  Asset_Vendor: z.string().max(50),
});

export type AssetVendorsInput = z.infer<typeof AssetVendorsSchema>;
