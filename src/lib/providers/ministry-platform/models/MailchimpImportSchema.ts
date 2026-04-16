import { z } from 'zod';

export const MailchimpImportSchema = z.object({
  Email: z.string().max(50).nullable(),
  FirstName: z.string().max(50).nullable(),
  LastName: z.string().max(50).nullable(),
  Birthday: z.string().datetime().nullable(),
  MEMBER_RATING: z.string().max(50).nullable(),
  OPTIN_TIME: z.string().max(50).nullable(),
  OPTIN_IP: z.string().max(50).nullable(),
  CONFIRM_TIME: z.string().max(50).nullable(),
  CONFIRM_IP: z.string().max(50).nullable(),
  LATITUDE: z.string().max(50).nullable(),
  LAST_CHANGED: z.string().max(50).nullable(),
});

export type MailchimpImportInput = z.infer<typeof MailchimpImportSchema>;
