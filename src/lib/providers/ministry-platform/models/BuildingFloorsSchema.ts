import { z } from 'zod';

export const BuildingFloorsSchema = z.object({
  Building_Floor_ID: z.number().int(),
  Floor_Name: z.string().max(50),
  Building_ID: z.number().int().nullable(),
});

export type BuildingFloorsInput = z.infer<typeof BuildingFloorsSchema>;
