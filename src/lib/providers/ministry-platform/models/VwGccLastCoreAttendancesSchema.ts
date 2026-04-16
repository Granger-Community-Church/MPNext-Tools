import { z } from 'zod';

export const VwGccLastCoreAttendancesSchema = z.object({
  Contact_ID: z.number().int(),
  Participant_ID: z.number().int().nullable(),
  Display_Name: z.string().max(125).nullable(),
  User_Account: z.number().int().nullable(),
  Core_Class_101_Date: z.string().datetime().nullable(),
  Core_Class_201_Date: z.string().datetime().nullable(),
  Core_Class_301_Date: z.string().datetime().nullable(),
  Core_Class_401_Date: z.string().datetime().nullable(),
  Training_101_1_Date: z.string().datetime().nullable(),
  Training_101_2_Date: z.string().datetime().nullable(),
  Training_101_3_Date: z.string().datetime().nullable(),
  Training_101_4_Date: z.string().datetime().nullable(),
  Training_101_5_Date: z.string().datetime().nullable(),
  Training_201_1_Date: z.string().datetime().nullable(),
  Training_201_2_Date: z.string().datetime().nullable(),
  Training_201_3_Date: z.string().datetime().nullable(),
  Training_201_4_Date: z.string().datetime().nullable(),
  Training_201_5_Date: z.string().datetime().nullable(),
  Training_301_1_Date: z.string().datetime().nullable(),
  Training_301_2_Date: z.string().datetime().nullable(),
  Training_301_3_Date: z.string().datetime().nullable(),
  Training_301_4_Date: z.string().datetime().nullable(),
  Training_301_5_Date: z.string().datetime().nullable(),
  Training_401_1_Date: z.string().datetime().nullable(),
  Training_401_2_Date: z.string().datetime().nullable(),
  Training_401_3_Date: z.string().datetime().nullable(),
  Training_401_4_Date: z.string().datetime().nullable(),
});

export type VwGccLastCoreAttendancesInput = z.infer<typeof VwGccLastCoreAttendancesSchema>;
