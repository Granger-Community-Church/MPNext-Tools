/**
 * Interface for _MSCamp_Commit_History
* Table: _MSCamp_Commit_History
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface MscampCommitHistory {

  Camp_Commit_ID: number /* 32-bit integer */; // Primary Key

  Participant_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Participants.Participant_ID

  /**
   * Max length: 255 characters
   */
  First_Name?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Last_Name?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Grade?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Counselor?: string /* max 255 chars */ | null;

  First_Time_Decision?: boolean | null;

  Recommitment?: boolean | null;

  /**
   * Max length: 2000 characters
   */
  Notes?: string /* max 2000 chars */ | null;

  Camp_Event_ID: number /* 32-bit integer */; // Foreign Key -> Events.Event_ID

  Camp_Year?: number /* 32-bit integer */ | null;
}

export type MscampCommitHistoryRecord = MscampCommitHistory;
