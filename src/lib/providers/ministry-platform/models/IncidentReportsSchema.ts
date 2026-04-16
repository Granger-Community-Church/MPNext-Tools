import { z } from 'zod';

export const IncidentReportsSchema = z.object({
  Incident_Report_ID: z.number().int(),
  Incident_Date: z.string().datetime(),
  Incident_End_Date: z.string().datetime().nullable(),
  Involved_Contact_ID: z.number().int().nullable(),
  Reporting_Party_Contact_ID: z.number().int().nullable(),
  Incident_Location: z.string().max(250).nullable(),
  Incident_Type: z.number().int().nullable(),
  Department: z.number().int().nullable(),
  Room: z.number().int().nullable(),
  Other_Involved_Parties: z.string().max(500).nullable(),
  Notes: z.string().max(4000).nullable(),
});

export type IncidentReportsInput = z.infer<typeof IncidentReportsSchema>;
