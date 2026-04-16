import { z } from 'zod';

export const BackgroundcheckAllSs20170306Schema = z.object({
  Last_Name_Applicant: z.string().max(255).nullable(),
  First_Name_Applicant: z.string().max(255).nullable(),
  Date_Entered: z.string().datetime().nullable(),
  Time_Entered: z.string().max(255).nullable(),
  Ministry_SS: z.string().max(255).nullable(),
  Flag: z.string().max(255).nullable(),
  Profile_Number: z.number().int().nullable(),
  F8: z.string().max(255).nullable(),
});

export type BackgroundcheckAllSs20170306Input = z.infer<typeof BackgroundcheckAllSs20170306Schema>;
