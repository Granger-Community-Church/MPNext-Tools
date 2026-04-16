import { z } from 'zod';

export const IncidentTypesSchema = z.object({
  Incident_Type_ID: z.number().int(),
  Incident_Type: z.string().max(50),
});

export type IncidentTypesInput = z.infer<typeof IncidentTypesSchema>;
