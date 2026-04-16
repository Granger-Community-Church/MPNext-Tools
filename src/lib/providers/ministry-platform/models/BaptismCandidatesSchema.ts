import { z } from 'zod';

export const BaptismCandidatesSchema = z.object({
  Baptism_Candidate_ID: z.number().int(),
  Participant_ID: z.number().int(),
  Baptism_Candidate_Type_ID: z.number().int().nullable(),
  Orientation_Event: z.number().int().nullable(),
  Candidate_Start: z.string().datetime(),
  Candidate_End: z.string().datetime().nullable(),
  Candidate_Notes: z.string().max(2000).nullable(),
  Tshirt_Size: z.string().max(50).nullable(),
  Testimony_Received: z.string().datetime().nullable(),
  Testimony: z.number().int().nullable(),
  Bible_Status_ID: z.number().int().nullable(),
  Bible_Type_ID: z.number().int().nullable(),
  Response_ID: z.number().int().nullable(),
  Baptism_Event: z.number().int().nullable(),
  Participant_Milestone_ID: z.number().int().nullable(),
});

export type BaptismCandidatesInput = z.infer<typeof BaptismCandidatesSchema>;
