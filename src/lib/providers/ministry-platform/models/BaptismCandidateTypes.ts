/**
 * Interface for Baptism_Candidate_Types
* Table: Baptism_Candidate_Types
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface BaptismCandidateTypes {

  Baptism_Candidate_Type_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Candidate_Type: string /* max 50 chars */;
}

export type BaptismCandidateTypesRecord = BaptismCandidateTypes;
