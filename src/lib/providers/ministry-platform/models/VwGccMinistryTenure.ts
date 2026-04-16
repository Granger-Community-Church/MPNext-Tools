/**
 * Interface for vw_gcc_ministry_tenure
* Table: vw_gcc_ministry_tenure
 * Access Level: Read
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface VwGccMinistryTenure {

  Group_Participant_ID: number /* 32-bit integer */;

  /**
   * Max length: 125 characters
   */
  Display_Name?: string /* max 125 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Nickname?: string /* max 50 chars */ | null;

  Ministry_ID: number /* 32-bit integer */;

  /**
   * Max length: 50 characters
   */
  Current_Role_Title: string /* max 50 chars */;

  Current_Role_Start: string /* ISO datetime */;

  /**
   * Max length: 50 characters
   */
  Ministry_Name: string /* max 50 chars */;

  Earliest_Service: string /* ISO datetime */;

  Service_Months?: number /* 32-bit integer */ | null;

  Service_Years?: number /* 32-bit integer */ | null;

  Is_Uninterrupted: number /* 32-bit integer */;

  Gap_Months: number /* 32-bit integer */;

  Participant_ID: number /* 32-bit integer */;

  Contact_ID: number /* 32-bit integer */; // Primary Key
}

export type VwGccMinistryTenureRecord = VwGccMinistryTenure;
