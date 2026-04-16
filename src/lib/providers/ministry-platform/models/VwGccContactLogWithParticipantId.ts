/**
 * Interface for vw_gcc_contact_log_with_participant_id
* Table: vw_gcc_contact_log_with_participant_id
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccContactLogWithParticipantId {

  Contact_Log_ID: number /* 32-bit integer */; // Primary Key

  Contact_ID: number /* 32-bit integer */;

  Participant_Record?: number /* 32-bit integer */ | null;

  Contact_Date: string /* ISO datetime */;

  Contact_Log_Type_ID?: number /* 32-bit integer */ | null;

  Made_By: number /* 32-bit integer */;

  /**
   * Max length: 2000 characters
   */
  Notes: string /* max 2000 chars */;

  Planned_Contact_ID?: number /* 32-bit integer */ | null;

  Contact_Successful?: boolean | null;

  Original_Contact_Log_Entry?: number /* 32-bit integer */ | null;

  /**
   * Max length: 2000 characters
   */
  Confidential_Notes?: string /* max 2000 chars */ | null;

  Feedback_Entry_ID?: number /* 32-bit integer */ | null;
}

export type VwGccContactLogWithParticipantIdRecord = VwGccContactLogWithParticipantId;
