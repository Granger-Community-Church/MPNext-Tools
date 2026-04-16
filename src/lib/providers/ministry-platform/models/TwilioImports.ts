/**
 * Interface for Twilio_Imports
* Table: Twilio_Imports
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport
 * Generated from column metadata
 */
export interface TwilioImports {

  Twilio_Import_ID: number /* 32-bit integer */; // Primary Key

  Contact_ID: number /* 32-bit integer */; // Foreign Key -> Contacts.Contact_ID

  /**
   * Max length: 50 characters
   */
  Contact_Number: string /* max 50 chars */;

  /**
   * Max length: 500 characters
   */
  Notes?: string /* max 500 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Date_Received?: string /* max 50 chars */ | null;
}

export type TwilioImportsRecord = TwilioImports;
