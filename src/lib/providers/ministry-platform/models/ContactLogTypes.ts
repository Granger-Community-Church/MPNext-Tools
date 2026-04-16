/**
 * Interface for Contact_Log_Types
* Table: Contact_Log_Types
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface ContactLogTypes {

  Contact_Log_Type_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Contact_Log_Type: string /* max 50 chars */;

  /**
   * Max length: 500 characters
   */
  Description?: string /* max 500 chars */ | null;

  User_Group_ID?: number /* 32-bit integer */ | null; // Foreign Key -> dp_User_Groups.User_Group_ID
}

export type ContactLogTypesRecord = ContactLogTypes;
