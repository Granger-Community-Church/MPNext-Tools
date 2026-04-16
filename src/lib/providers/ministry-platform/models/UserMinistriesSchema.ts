import { z } from 'zod';

export const UserMinistriesSchema = z.object({
  User_Ministry_ID: z.number().int(),
  User_ID: z.number().int(),
  Ministry_ID: z.number().int(),
  Default_Ministry: z.boolean(),
  Discontinued: z.boolean(),
});

export type UserMinistriesInput = z.infer<typeof UserMinistriesSchema>;
