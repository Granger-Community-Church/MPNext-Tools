/**
 * Interface for vw_mp_mqna_mw_summary_by_congregation
* Table: vw_mp_mqna_mw_summary_by_congregation
 * Access Level: Read
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface VwMpMqnaMwSummaryByCongregation {

  Period_Congregation_ID?: number /* 64-bit integer */ | null; // Primary Key

  /**
   * Max length: 4000 characters
   */
  Years_Since: string /* max 4000 chars */;

  Fiscal_Year_Start: string /* ISO datetime */;

  /**
   * Max length: 4000 characters
   */
  Periods_Since: string /* max 4000 chars */;

  Fiscal_Period_Start: string /* ISO datetime */;

  Fiscal_Period_Month?: number /* 32-bit integer */ | null;

  /**
   * Max length: 4000 characters
   */
  Weeks_Since: string /* max 4000 chars */;

  Ministry_Week_Start: string /* ISO datetime */;

  /**
   * Max length: 50 characters
   */
  Ministry_Week_Type: string /* max 50 chars */;

  /**
   * Max length: 50 characters
   */
  Congregation_Name: string /* max 50 chars */;

  /**
   * Max length: 4000 characters
   */
  Active_Adults?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  "Digital Attnd"?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Gen_Fund?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  GSM_Worship?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  "In-Person Attnd"?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  "Kids Families"?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  "Life Group %"?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  New_Donors?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  "Student HH"?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Kids_Worship?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Decisions?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  New_Guests?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Baptisms?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Life_Groups?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Group_Leaders?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Group_Members?: string /* max 4000 chars */ | null;

  Congregation_ID?: number /* 32-bit integer */ | null;
}

export type VwMpMqnaMwSummaryByCongregationRecord = VwMpMqnaMwSummaryByCongregation;
