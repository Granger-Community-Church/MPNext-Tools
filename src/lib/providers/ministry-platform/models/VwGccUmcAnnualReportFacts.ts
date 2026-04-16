/**
 * Interface for vw_gcc_umc_annual_report_facts
* Table: vw_gcc_umc_annual_report_facts
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccUmcAnnualReportFacts {

  /**
   * Max length: 53 characters
   */
  Question: string /* max 53 chars */;

  Date_Accomplished?: string /* ISO datetime */ | null;

  /**
   * Max length: 21 characters
   */
  Report: string /* max 21 chars */;

  Record_PK: number /* 32-bit integer */;

  Sort_Order: number /* 32-bit integer */;
}

export type VwGccUmcAnnualReportFactsRecord = VwGccUmcAnnualReportFacts;
