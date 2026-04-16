/**
 * Interface for dp_Selections
* Table: dp_Selections
 * Access Level: ReadWrite
 * Special Permissions: None
 * Generated from column metadata
 */
export interface DpSelections {

  Selection_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Selection_Name: string /* max 50 chars */;

  Page_ID: number /* 32-bit integer */; // Foreign Key -> dp_Pages.Page_ID

  User_ID: number /* 32-bit integer */; // Foreign Key -> dp_Users.User_ID

  Sub_Page_ID?: number /* 32-bit integer */ | null; // Foreign Key -> dp_Sub_Pages.Sub_Page_ID

  Expiration_Date?: string /* ISO datetime */ | null;

  Selection_Kind: unknown; // Has Default

  Parent_Record_ID?: number /* 32-bit integer */ | null;
}

export type DpSelectionsRecord = DpSelections;
