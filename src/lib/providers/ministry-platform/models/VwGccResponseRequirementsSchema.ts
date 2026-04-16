import { z } from 'zod';

export const VwGccResponseRequirementsSchema = z.object({
  Read_Only_PK: z.number().int().nullable(),
  Response_ID: z.number().int(),
  Strictly_Enforced: z.boolean(),
  Certification_Type: z.string().max(50),
  Requirement_Status: z.string().max(15),
  Certification_Submitted: z.string().datetime().nullable(),
  Certification_Completed: z.string().datetime().nullable(),
  Passed: z.boolean().nullable(),
  Certification_Expires: z.string().datetime().nullable(),
  Form_Response_ID: z.number().int().nullable(),
  Reference_Name: z.string().max(254).nullable(),
});

export type VwGccResponseRequirementsInput = z.infer<typeof VwGccResponseRequirementsSchema>;
