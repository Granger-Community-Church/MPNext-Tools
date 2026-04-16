import { z } from 'zod';

export const EventTypesSchema = z.object({
  Event_Type_ID: z.number().int(),
  Event_Type: z.string().max(50),
  Description: z.string().max(255).nullable(),
  Required_Event_Type: z.number().int().nullable(),
  Milestone: z.number().int().nullable(),
  Omit_From_Engagement_Attendance: z.boolean(),
  Color: z.string().max(25).nullable(),
  Show_On_MPMobile: z.boolean(),
  Public_By_Default: z.boolean(),
  Auto_Approve: z.boolean().nullable(),
  Show_In_Picklist: z.boolean().nullable(),
  Auto_Close_Registrations: z.boolean(),
  Promote_Additional_Dates: z.boolean(),
});

export type EventTypesInput = z.infer<typeof EventTypesSchema>;
