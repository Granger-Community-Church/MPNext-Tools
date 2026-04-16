/**
 * Interface for Employment_Statuses
* Table: Employment_Statuses
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface EmploymentStatuses {

  Employment_Status_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Employment_Status?: string /* max 50 chars */ | null;
}

export type EmploymentStatusesRecord = EmploymentStatuses;
