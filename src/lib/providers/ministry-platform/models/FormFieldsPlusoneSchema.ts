import { z } from 'zod';

export const FormFieldsPlusoneSchema = z.object({
  Form_Fields_PlusOne_ID: z.number().int(),
  PlusOne_Type: z.string().max(50),
  PlusOne_Notes: z.string().max(500).nullable(),
});

export type FormFieldsPlusoneInput = z.infer<typeof FormFieldsPlusoneSchema>;
