import { z } from 'zod';

export const CongregationReportsSchema = z.object({
  Congregation_Report_ID: z.number().int(),
  Congregation_ID: z.number().int(),
  Period_Start: z.string().datetime().nullable(),
  Period_End: z.string().datetime().nullable(),
  Service_Number: z.number().int().nullable(),
  Event_ID: z.number().int().nullable(),
  Holiday_ID: z.number().int().nullable(),
  Speaker: z.number().int().nullable(),
  Sermon_Series_ID: z.number().int().nullable(),
  Sermon_Title: z.string().max(100).nullable(),
  Auditorium: z.number().int().nullable(),
  Child_Attendance: z.number().int().nullable(),
  Online_Attendance: z.number().int().nullable(),
  HS_Attendance: z.number().int().nullable(),
  MS_Attendance: z.number().int().nullable(),
  Volunteer_Attendance: z.number().int().nullable(),
  General_Fund: z.number().nullable(),
  Building_Fund: z.number().nullable(),
  Digital_Giving_GF: z.number().nullable(),
  Missions_Fund: z.number().nullable(),
  Christmas: z.number().nullable(),
  Budget_Goal: z.number().nullable(),
  New_Donors_Num: z.number().int().nullable(),
  New_Donor_Amt: z.number().nullable(),
  PayPal_GF: z.number().nullable(),
  Bookstore: z.number().nullable(),
  Cafe: z.number().nullable(),
  Message_Sales: z.number().nullable(),
});

export type CongregationReportsInput = z.infer<typeof CongregationReportsSchema>;
