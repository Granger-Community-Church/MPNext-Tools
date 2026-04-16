/**
 * Interface for Circles
* Table: Circles
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface Circles {

  Circle_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Circle: string /* max 50 chars */;

  Joined_Milestone?: number /* 32-bit integer */ | null; // Foreign Key -> Milestones.Milestone_ID
}

export type CirclesRecord = Circles;
