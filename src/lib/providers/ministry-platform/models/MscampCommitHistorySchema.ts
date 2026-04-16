import { z } from 'zod';

export const MscampCommitHistorySchema = z.object({
  Camp_Commit_ID: z.number().int(),
  Participant_ID: z.number().int().nullable(),
  First_Name: z.string().max(255).nullable(),
  Last_Name: z.string().max(255).nullable(),
  Grade: z.string().max(255).nullable(),
  Counselor: z.string().max(255).nullable(),
  First_Time_Decision: z.boolean().nullable(),
  Recommitment: z.boolean().nullable(),
  Notes: z.string().max(2000).nullable(),
  Camp_Event_ID: z.number().int(),
  Camp_Year: z.number().int().nullable(),
});

export type MscampCommitHistoryInput = z.infer<typeof MscampCommitHistorySchema>;
