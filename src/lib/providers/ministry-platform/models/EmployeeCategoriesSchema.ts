import { z } from 'zod';

export const EmployeeCategoriesSchema = z.object({
  Employee_Category_ID: z.number().int(),
  Employee_Category: z.string().max(50).nullable(),
});

export type EmployeeCategoriesInput = z.infer<typeof EmployeeCategoriesSchema>;
