import { z } from 'zod';

export const TempGroupsSchema = z.object({
  Temp_Group_Name: z.string().max(50).nullable(),
});

export type TempGroupsInput = z.infer<typeof TempGroupsSchema>;
