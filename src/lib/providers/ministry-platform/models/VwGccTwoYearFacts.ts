/**
 * Interface for vw_gcc_two_year_facts
* Table: vw_gcc_two_year_facts
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccTwoYearFacts {

  /**
   * Max length: 31 characters
   */
  GCC_Metric_Name: string /* max 31 chars */;

  Date_Accomplished?: string /* ISO datetime */ | null;

  /**
   * Max length: 12 characters
   */
  Area: string /* max 12 chars */;

  Sort_Order: number /* 32-bit integer */;
}

export type VwGccTwoYearFactsRecord = VwGccTwoYearFacts;
