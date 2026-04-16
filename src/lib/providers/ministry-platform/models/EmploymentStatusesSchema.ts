import { z } from 'zod';

export const EmploymentStatusesSchema = z.object({
  Employment_Status_ID: z.number().int(),
  Employment_Status: z.string().max(50).nullable(),
});

export type EmploymentStatusesInput = z.infer<typeof EmploymentStatusesSchema>;
