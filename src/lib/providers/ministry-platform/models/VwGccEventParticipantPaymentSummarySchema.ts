import { z } from 'zod';

export const VwGccEventParticipantPaymentSummarySchema = z.object({
  Read_Only_PK: z.number().int(),
  Event_Participant_ID: z.number().int(),
  Event_ID: z.number().int(),
  Product_ID: z.number().int(),
  Invoice_ID: z.number().int().nullable(),
  Participant_Owed: z.number().nullable(),
  Participant_Paid: z.number(),
  Participant_Unpaid: z.number().nullable(),
  Last_Payment_ID: z.number().int().nullable(),
});

export type VwGccEventParticipantPaymentSummaryInput = z.infer<typeof VwGccEventParticipantPaymentSummarySchema>;
