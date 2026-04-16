/**
 * Interface for Baptism_Candidates
* Table: Baptism_Candidates
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface BaptismCandidates {

  Baptism_Candidate_ID: number /* 32-bit integer */; // Primary Key

  Participant_ID: number /* 32-bit integer */; // Foreign Key -> Participants.Participant_ID

  Baptism_Candidate_Type_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Baptism_Candidate_Types.Baptism_Candidate_Type_ID

  Orientation_Event?: number /* 32-bit integer */ | null; // Foreign Key -> Event_Participants.Event_Participant_ID

  Candidate_Start: string /* ISO datetime */; // Has Default

  Candidate_End?: string /* ISO datetime */ | null;

  /**
   * Max length: 2000 characters
   */
  Candidate_Notes?: string /* max 2000 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Tshirt_Size?: string /* max 50 chars */ | null;

  Testimony_Received?: string /* ISO datetime */ | null;

  Testimony?: number /* 32-bit integer */ | null; // Foreign Key -> Form_Responses.Form_Response_ID

  Bible_Status_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Bible_Statuses.Bible_Status_ID

  Bible_Type_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Bible_Types.Bible_Type_ID

  Response_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Responses.Response_ID

  Baptism_Event?: number /* 32-bit integer */ | null; // Foreign Key -> Event_Participants.Event_Participant_ID

  Participant_Milestone_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Participant_Milestones.Participant_Milestone_ID
}

export type BaptismCandidatesRecord = BaptismCandidates;
