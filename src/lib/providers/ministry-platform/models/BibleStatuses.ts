/**
 * Interface for Bible_Statuses
* Table: Bible_Statuses
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface BibleStatuses {

  Bible_Status_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Bible_Status: string /* max 50 chars */;
}

export type BibleStatusesRecord = BibleStatuses;
