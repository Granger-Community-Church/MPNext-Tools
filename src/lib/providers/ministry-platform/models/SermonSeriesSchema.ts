import { z } from 'zod';

export const SermonSeriesSchema = z.object({
  Sermon_Series_ID: z.number().int(),
  Sermon_Series: z.string().max(100),
});

export type SermonSeriesInput = z.infer<typeof SermonSeriesSchema>;
