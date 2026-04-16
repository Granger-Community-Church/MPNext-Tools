import { z } from 'zod';

export const AssetsSchema = z.object({
  Asset_ID: z.number().int(),
  Owner: z.number().int().nullable(),
  Nickname: z.string().max(100).nullable(),
  Department: z.number().int().nullable(),
  Serial_Number: z.string().max(50).nullable(),
  Asset_Number: z.string().max(50).nullable(),
  Model: z.number().int().nullable(),
  Notes: z.string().max(2000).nullable(),
  Date_Retired: z.string().datetime().nullable(),
  Purchase_Date: z.string().datetime().nullable(),
  Purchase_Price: z.number(),
  Warranty_Price: z.number(),
  Total_Cost: z.number().nullable(),
  TechOps_Purchase: z.boolean().nullable(),
  Order_Number: z.string().max(50).nullable(),
  Vendor: z.number().int().nullable(),
  Warranty_End_Date: z.string().datetime().nullable(),
  Refurbished: z.boolean().nullable(),
  Processor: z.string().max(50).nullable(),
  HDD_Size: z.string().max(50).nullable(),
  RAM: z.string().max(50).nullable(),
});

export type AssetsInput = z.infer<typeof AssetsSchema>;
