import { z } from 'zod';

export const MediaarchiveimportSchema = z.object({
  Media_Title: z.string().max(255).nullable(),
  Media_Description: z.string().max(255).nullable(),
  Category_ID: z.string().max(255).nullable(),
  Media_Type: z.string().max(255).nullable(),
  Media_Label: z.string().max(255).nullable(),
  Label_ID: z.string().max(255).nullable(),
  Container_ID: z.string().max(255).nullable(),
  Location: z.string().max(255).nullable(),
  Source: z.string().max(255).nullable(),
  Originator_Name: z.string().max(255).nullable(),
  Media_Year: z.number().int().nullable(),
  CheckIn_Date: z.string().datetime().nullable(),
  CheckOut_Date: z.string().max(255).nullable(),
  Checked_Out_To: z.string().max(255).nullable(),
});

export type MediaarchiveimportInput = z.infer<typeof MediaarchiveimportSchema>;
