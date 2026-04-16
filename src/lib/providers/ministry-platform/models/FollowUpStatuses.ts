/**
 * Interface for Follow_Up_Statuses
* Table: Follow_Up_Statuses
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface FollowUpStatuses {

  Follow_Up_Status_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Follow_Up_Status: string /* max 50 chars */;
}

export type FollowUpStatusesRecord = FollowUpStatuses;
