import { z } from 'zod';

export const EmployeeImport20170406Schema = z.object({
  employee_contact_id: z.string().max(50).nullable(),
  last_name: z.string().max(50).nullable(),
  first_name: z.string().max(50).nullable(),
  middle_name: z.string().max(50).nullable(),
  Position: z.string().max(2147483647).nullable(),
  phone_extension: z.string().max(2147483647).nullable(),
  Email: z.string().max(50).nullable(),
  employ_status_id: z.string().max(50).nullable(),
  hire_date: z.string().datetime().nullable(),
  year_service: z.string().max(50).nullable(),
  Birthday: z.string().max(50).nullable(),
  category_id: z.string().max(50).nullable(),
  Category: z.string().max(50).nullable(),
});

export type EmployeeImport20170406Input = z.infer<typeof EmployeeImport20170406Schema>;
