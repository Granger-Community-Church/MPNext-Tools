import { z } from 'zod';

export const AssetInventory20170314Schema = z.object({
  "Assigned To": z.string().max(500).nullable(),
  Dept: z.string().max(50).nullable(),
  location: z.string().max(50).nullable(),
  type: z.string().max(50).nullable(),
  Comments: z.string().max(50).nullable(),
  "serial#": z.string().max(50).nullable(),
  Status: z.string().max(50).nullable(),
  OEM: z.string().max(50).nullable(),
  "model #": z.string().max(50).nullable(),
  refurb: z.string().max(50).nullable(),
  "Order Date": z.string().max(50).nullable(),
  "order #": z.string().max(50).nullable(),
  "sold by": z.string().max(50).nullable(),
  cost: z.string().max(50).nullable(),
  extras: z.string().max(500).nullable(),
  "3yr care": z.string().max(50).nullable(),
  $back: z.string().max(50).nullable(),
  spent: z.string().max(50).nullable(),
  "3yr cost": z.string().max(50).nullable(),
  repairs: z.string().max(2000).nullable(),
  spa: z.string().max(500).nullable(),
  "other notes info": z.string().max(2000).nullable(),
});

export type AssetInventory20170314Input = z.infer<typeof AssetInventory20170314Schema>;
