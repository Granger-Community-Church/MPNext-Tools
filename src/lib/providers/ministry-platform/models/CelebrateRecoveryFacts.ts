/**
 * Interface for Celebrate_Recovery_Facts
* Table: Celebrate_Recovery_Facts
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport
 * Generated from column metadata
 */
export interface CelebrateRecoveryFacts {

  Celebrate_Recovery_Fact_ID: number /* 32-bit integer */; // Primary Key

  Event_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Events.Event_ID

  Participants: number /* 32-bit integer */; // Has Default

  Newcomers_101: number /* 32-bit integer */; // Has Default

  Crawl_Steps: number /* 32-bit integer */; // Has Default

  Walk_Steps: number /* 32-bit integer */; // Has Default

  Run_Steps: number /* 32-bit integer */; // Has Default

  Chip_Surrender: number /* 32-bit integer */; // Has Default

  Chip_30_Day: number /* 32-bit integer */; // Has Default

  Chip_60_Day: number /* 32-bit integer */; // Has Default

  Chip_90_Day: number /* 32-bit integer */; // Has Default

  Chip_04_Month: number /* 32-bit integer */; // Has Default

  Chip_05_Month: number /* 32-bit integer */; // Has Default

  Chip_06_Month: number /* 32-bit integer */; // Has Default

  Chip_07_Month: number /* 32-bit integer */; // Has Default

  Chip_08_Month: number /* 32-bit integer */; // Has Default

  Chip_09_Month: number /* 32-bit integer */; // Has Default

  Chip_10_Month: number /* 32-bit integer */; // Has Default

  Chip_11_Month: number /* 32-bit integer */; // Has Default

  Chip_01_Year: number /* 32-bit integer */; // Has Default

  _Total_Chips_Accepted?: number /* 32-bit integer */ | null; // Read Only, Computed

  _Setup_Date: string /* ISO datetime */; // Read Only, Has Default
}

export type CelebrateRecoveryFactsRecord = CelebrateRecoveryFacts;
