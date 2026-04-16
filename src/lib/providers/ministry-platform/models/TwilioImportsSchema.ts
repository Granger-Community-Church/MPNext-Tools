import { z } from 'zod';

export const TwilioImportsSchema = z.object({
  Twilio_Import_ID: z.number().int(),
  Contact_ID: z.number().int(),
  Contact_Number: z.string().max(50),
  Notes: z.string().max(500).nullable(),
  Date_Received: z.string().max(50).nullable(),
});

export type TwilioImportsInput = z.infer<typeof TwilioImportsSchema>;
