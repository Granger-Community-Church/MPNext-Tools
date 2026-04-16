/**
 * Interface for vw_gcc_umc_annual_report_summary
* Table: vw_gcc_umc_annual_report_summary
 * Access Level: Read
 * Special Permissions: DataExport
 * Generated from column metadata
 */
export interface VwGccUmcAnnualReportSummary {

  ID_Row?: number /* 64-bit integer */ | null;

  /**
   * Max length: 32 characters
   */
  Question: string /* max 32 chars */;

  /**
   * Max length: 21 characters
   */
  Report: string /* max 21 chars */;

  Last_Year_Count?: number /* 32-bit integer */ | null;

  Sort_Order: number /* 32-bit integer */;
}

export type VwGccUmcAnnualReportSummaryRecord = VwGccUmcAnnualReportSummary;
