/**
 * Interface for Pursuit
* Table: Pursuit
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface Pursuit {

  Pursuit_ID: number /* 32-bit integer */; // Primary Key

  Contact_ID: number /* 32-bit integer */; // Foreign Key -> Contacts.Contact_ID

  Spouse?: number /* 32-bit integer */ | null; // Foreign Key -> Contacts.Contact_ID

  Pursuit_Status_ID: number /* 32-bit integer */; // Foreign Key -> Pursuit_Statuses.Pursuit_Status_ID, Has Default

  Household_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Households.Household_ID

  Pursuit_Start: string /* ISO datetime */; // Has Default

  Pursuit_End?: string /* ISO datetime */ | null;

  Staff_Assigned?: number /* 32-bit integer */ | null; // Foreign Key -> dp_Users.User_ID

  /**
   * Max length: 2000 characters
   */
  Pursuit_Notes?: string /* max 2000 chars */ | null;
}

export type PursuitRecord = Pursuit;
