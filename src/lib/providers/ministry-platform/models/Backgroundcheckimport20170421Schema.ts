import { z } from 'zod';

export const Backgroundcheckimport20170421Schema = z.object({
  "Participant#": z.number().nullable(),
  Display_Name2: z.string().max(255).nullable(),
  campus: z.string().max(255).nullable(),
  dob: z.string().datetime().nullable(),
  "home ph": z.string().max(255).nullable(),
  "mobile ph": z.string().max(255).nullable(),
  add: z.string().max(255).nullable(),
  city: z.string().max(255).nullable(),
  state: z.string().max(255).nullable(),
  zip: z.string().max(255).nullable(),
  email: z.string().max(255).nullable(),
  hh: z.string().max(255).nullable(),
  position: z.string().max(255).nullable(),
  F14: z.string().max(255).nullable(),
  "BG CHECK DATE": z.string().datetime().nullable(),
  STATUS: z.string().max(2147483647).nullable(),
});

export type Backgroundcheckimport20170421Input = z.infer<typeof Backgroundcheckimport20170421Schema>;
