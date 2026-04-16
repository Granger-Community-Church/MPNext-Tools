import { z } from 'zod';

export const GccVwCoreIndividualsDatasetSchema = z.object({
  Contact_ID: z.number().int(),
  Participant_ID: z.number().int().nullable(),
  Display_Name: z.string().max(75),
  Age: z.number().int().nullable(),
  Gender: z.string().max(25).nullable(),
  Marital_Status: z.string().max(25).nullable(),
  Participant_Type: z.string().max(50),
  Contact_Status: z.string().max(50),
  Member_Status: z.string().max(50).nullable(),
  Core_Class_101_Date: z.string().datetime().nullable(),
  Core_Class_201_Date: z.string().datetime().nullable(),
  Core_Class_301_Date: z.string().datetime().nullable(),
  Core_Class_401_Date: z.string().datetime().nullable(),
});

export type GccVwCoreIndividualsDatasetInput = z.infer<typeof GccVwCoreIndividualsDatasetSchema>;
