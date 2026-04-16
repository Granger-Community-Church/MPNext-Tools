/**
 * Interface for vw_gcc_scorecard
* Table: vw_gcc_scorecard
 * Access Level: Read
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface VwGccScorecard {

  ID_Row?: number /* 64-bit integer */ | null; // Primary Key

  /**
   * Max length: 12 characters
   */
  Area: string /* max 12 chars */;

  /**
   * Max length: 50 characters
   */
  GCC_Metric_Name: string /* max 50 chars */;

  Last_Year_Count?: number /* 32-bit integer */ | null;

  YTD_Last_Year_Count?: number /* 32-bit integer */ | null;

  Goal?: number /* 32-bit integer */ | null;

  This_Year_Count?: number /* 32-bit integer */ | null;

  This_Year_Q1_Count?: number /* 32-bit integer */ | null;

  This_Year_Q2_Count?: number /* 32-bit integer */ | null;

  This_Year_Q3_Count?: number /* 32-bit integer */ | null;

  This_Year_Q4_Count?: number /* 32-bit integer */ | null;
}

export type VwGccScorecardRecord = VwGccScorecard;
