import { z } from 'zod';

export const AssetServiceReportsSchema = z.object({
  Asset_Service_Report_ID: z.number().int(),
  Asset_ID: z.number().int(),
  Service_Date: z.string().datetime().nullable(),
  Service_Type: z.number().int().nullable(),
  Labor_Cost: z.number(),
  Parts_Cost: z.number(),
  Serviced_By: z.number().int().nullable(),
  Repair_Total: z.number().nullable(),
  Notes: z.string().max(2000).nullable(),
});

export type AssetServiceReportsInput = z.infer<typeof AssetServiceReportsSchema>;
