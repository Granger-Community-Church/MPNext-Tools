import { z } from 'zod';

export const TwilioImport20200217Schema = z.object({
  Contact_ID: z.number().int(),
  FromNumber: z.string().max(50).nullable(),
  Contact_Number: z.string().max(50).nullable(),
  Body: z.string().max(255).nullable(),
  Status: z.string().max(255).nullable(),
  SentDate: z.string().max(255).nullable(),
});

export type TwilioImport20200217Input = z.infer<typeof TwilioImport20200217Schema>;
