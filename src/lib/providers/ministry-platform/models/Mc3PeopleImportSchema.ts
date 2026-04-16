import { z } from 'zod';

export const Mc3PeopleImportSchema = z.object({
  Last_Name: z.string().max(255).nullable(),
  First_Name: z.string().max(255).nullable(),
  Address_Line_1: z.string().max(255).nullable(),
  Postal_Code: z.number().nullable(),
  Birthdate: z.string().datetime().nullable(),
  Date_of_Birth: z.string().datetime().nullable(),
  Mobile_Phone: z.string().max(255).nullable(),
  Gender_ID: z.number().nullable(),
  Gender: z.string().max(255).nullable(),
});

export type Mc3PeopleImportInput = z.infer<typeof Mc3PeopleImportSchema>;
