/**
 * Interface for vw_gcc_ministry_tenure_months
* Table: vw_gcc_ministry_tenure_months
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccMinistryTenureMonths {

  Ministry_ID: number /* 32-bit integer */;

  Participant_ID: number /* 32-bit integer */;

  Months_Serving?: number /* 32-bit integer */ | null;
}

export type VwGccMinistryTenureMonthsRecord = VwGccMinistryTenureMonths;
