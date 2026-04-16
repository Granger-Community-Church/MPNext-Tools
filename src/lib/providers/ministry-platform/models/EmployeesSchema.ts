import { z } from 'zod';

export const EmployeesSchema = z.object({
  Employee_ID: z.number().int(),
  Contact: z.number().int(),
  Job_Title: z.string().max(250).nullable(),
  Extension: z.number().int().nullable(),
  Employment_Status: z.number().int().nullable(),
  Start_Date: z.string().datetime().nullable(),
  End_Date: z.string().datetime().nullable(),
  _Years_Of_Service: z.number().nullable(),
  Employee_Category: z.number().int().nullable(),
  Department_ID: z.number().int().nullable(),
  Supervisor_ID: z.number().int().nullable(),
  Frontline_Leader: z.boolean(),
  Last_Hot_Seat: z.string().datetime().nullable(),
});

export type EmployeesInput = z.infer<typeof EmployeesSchema>;
