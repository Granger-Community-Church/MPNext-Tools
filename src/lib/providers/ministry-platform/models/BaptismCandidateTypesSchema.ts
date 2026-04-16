import { z } from 'zod';

export const BaptismCandidateTypesSchema = z.object({
  Baptism_Candidate_Type_ID: z.number().int(),
  Candidate_Type: z.string().max(50),
});

export type BaptismCandidateTypesInput = z.infer<typeof BaptismCandidateTypesSchema>;
