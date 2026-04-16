import { z } from 'zod';

export const MediaContainersSchema = z.object({
  Media_Container_ID: z.number().int(),
  Container_Name: z.string().max(50),
});

export type MediaContainersInput = z.infer<typeof MediaContainersSchema>;
