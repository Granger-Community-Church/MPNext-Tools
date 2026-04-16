import { z } from 'zod';

export const HolidaysSchema = z.object({
  Holiday_ID: z.number().int(),
  Holiday: z.string().max(50),
});

export type HolidaysInput = z.infer<typeof HolidaysSchema>;
