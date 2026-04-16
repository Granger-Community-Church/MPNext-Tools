import { z } from 'zod';

export const BibleRequestsSchema = z.object({
  Bible_Request_ID: z.number().int(),
  Contact_ID: z.number().int(),
  Request_Date: z.string().datetime(),
  Request_Notes: z.string().max(2000).nullable(),
  Program_ID: z.number().int().nullable(),
  Bible_Type_ID: z.number().int(),
  Bible_Status_ID: z.number().int(),
  Pastor: z.number().int().nullable(),
  Baptism_Candidate_ID: z.number().int().nullable(),
  Form_Response_Answer_ID: z.number().int().nullable(),
  Response_ID: z.number().int().nullable(),
});

export type BibleRequestsInput = z.infer<typeof BibleRequestsSchema>;
