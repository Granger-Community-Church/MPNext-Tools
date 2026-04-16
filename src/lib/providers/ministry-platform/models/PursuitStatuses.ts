/**
 * Interface for Pursuit_Statuses
* Table: Pursuit_Statuses
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface PursuitStatuses {

  Pursuit_Status_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Pursuit_Status: string /* max 50 chars */;
}

export type PursuitStatusesRecord = PursuitStatuses;
