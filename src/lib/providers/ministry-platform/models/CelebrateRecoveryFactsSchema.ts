import { z } from 'zod';

export const CelebrateRecoveryFactsSchema = z.object({
  Celebrate_Recovery_Fact_ID: z.number().int(),
  Event_ID: z.number().int().nullable(),
  Participants: z.number().int(),
  Newcomers_101: z.number().int(),
  Crawl_Steps: z.number().int(),
  Walk_Steps: z.number().int(),
  Run_Steps: z.number().int(),
  Chip_Surrender: z.number().int(),
  Chip_30_Day: z.number().int(),
  Chip_60_Day: z.number().int(),
  Chip_90_Day: z.number().int(),
  Chip_04_Month: z.number().int(),
  Chip_05_Month: z.number().int(),
  Chip_06_Month: z.number().int(),
  Chip_07_Month: z.number().int(),
  Chip_08_Month: z.number().int(),
  Chip_09_Month: z.number().int(),
  Chip_10_Month: z.number().int(),
  Chip_11_Month: z.number().int(),
  Chip_01_Year: z.number().int(),
  _Total_Chips_Accepted: z.number().int().nullable(),
  _Setup_Date: z.string().datetime(),
});

export type CelebrateRecoveryFactsInput = z.infer<typeof CelebrateRecoveryFactsSchema>;
