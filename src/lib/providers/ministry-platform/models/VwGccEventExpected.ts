/**
 * Interface for vw_gcc_event_expected
* Table: vw_gcc_event_expected
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccEventExpected {

  Read_Only_PK?: number /* 64-bit integer */ | null; // Primary Key

  Event_ID: number /* 32-bit integer */; // Foreign Key -> Events.Event_ID

  Participant_ID: number /* 32-bit integer */; // Foreign Key -> Participants.Participant_ID

  Group_Participant_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Group_Participants.Group_Participant_ID

  Event_Participant_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Event_Participants.Event_Participant_ID
}

export type VwGccEventExpectedRecord = VwGccEventExpected;
