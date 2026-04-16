import { z } from 'zod';

export const SubscriberScheduledMessagesSchema = z.object({
  Subscriber_Scheduled_Message_ID: z.number().int(),
  Publication_ID: z.number().int(),
  Communication_Template_ID: z.number().int(),
  Include_Opt_Outs: z.boolean(),
  Send_On: z.string().datetime(),
  Subject_Token_Text: z.string().max(254).nullable(),
  Body_Token_Text: z.string().max(4000).nullable(),
  Communication_ID: z.number().int().nullable(),
});

export type SubscriberScheduledMessagesInput = z.infer<typeof SubscriberScheduledMessagesSchema>;
