import { z } from 'zod';

export const CertificationTypesSchema = z.object({
  Certification_Type_ID: z.number().int(),
  Certification_Type: z.string().max(50),
  Description: z.string().max(256).nullable(),
  Months_Till_Expires: z.number().int(),
  Expiring_Soon_Days: z.number().int().nullable(),
  Vendor_ID: z.string().max(75).nullable(),
  Auto_Create_For_Responses: z.boolean(),
});

export type CertificationTypesInput = z.infer<typeof CertificationTypesSchema>;
