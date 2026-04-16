/**
 * Interface for Bible_Requests
* Table: Bible_Requests
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface BibleRequests {

  Bible_Request_ID: number /* 32-bit integer */; // Primary Key

  Contact_ID: number /* 32-bit integer */; // Foreign Key -> Contacts.Contact_ID

  Request_Date: string /* ISO datetime */; // Has Default

  /**
   * Max length: 2000 characters
   */
  Request_Notes?: string /* max 2000 chars */ | null;

  Program_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Programs.Program_ID

  Bible_Type_ID: number /* 32-bit integer */; // Foreign Key -> Bible_Types.Bible_Type_ID, Has Default

  Bible_Status_ID: number /* 32-bit integer */; // Foreign Key -> Bible_Statuses.Bible_Status_ID, Has Default

  Pastor?: number /* 32-bit integer */ | null; // Foreign Key -> dp_Users.User_ID

  Baptism_Candidate_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Baptism_Candidates.Baptism_Candidate_ID

  Form_Response_Answer_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Form_Response_Answers.Form_Response_Answer_ID

  Response_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Responses.Response_ID
}

export type BibleRequestsRecord = BibleRequests;
