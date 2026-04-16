import { z } from 'zod';

export const ParticipantCertificationsSchema = z.object({
  Participant_Certification_ID: z.number().int(),
  Participant_ID: z.number().int(),
  Certification_Type_ID: z.number().int(),
  Certification_Submitted: z.string().datetime(),
  Certification_Completed: z.string().datetime().nullable(),
  Passed: z.boolean().nullable(),
  Certification_Expires: z.string().datetime().nullable(),
  Certification_GUID: z.string().uuid(),
  Notes: z.string().max(500).nullable(),
  Reference_Name: z.string().max(254).nullable(),
  Reference_Email: z.string().max(254).nullable(),
  Reference_Release: z.number().int().nullable(),
  Message_Recipient: z.number().int().nullable(),
  Message_Template: z.number().int().nullable(),
  Form_Response_ID: z.number().int().nullable(),
});

export type ParticipantCertificationsInput = z.infer<typeof ParticipantCertificationsSchema>;
