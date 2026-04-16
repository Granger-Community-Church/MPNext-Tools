import { z } from 'zod';

export const BpCourseGroupsSchema = z.object({
  Course_Group_ID: z.number().int(),
  Course_ID: z.number().int(),
  Group_ID: z.number().int(),
  Start_Date: z.string().datetime(),
  End_Date: z.string().datetime().nullable(),
});

export type BpCourseGroupsInput = z.infer<typeof BpCourseGroupsSchema>;
