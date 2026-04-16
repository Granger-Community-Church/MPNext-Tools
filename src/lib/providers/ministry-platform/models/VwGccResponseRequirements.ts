/**
 * Interface for vw_gcc_response_requirements
* Table: vw_gcc_response_requirements
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccResponseRequirements {

  Read_Only_PK?: number /* 64-bit integer */ | null; // Primary Key

  Response_ID: number /* 32-bit integer */; // Foreign Key -> Responses.Response_ID

  Strictly_Enforced: boolean;

  /**
   * Max length: 50 characters
   */
  Certification_Type: string /* max 50 chars */;

  /**
   * Max length: 15 characters
   */
  Requirement_Status: string /* max 15 chars */;

  Certification_Submitted?: string /* ISO datetime */ | null;

  Certification_Completed?: string /* ISO datetime */ | null;

  Passed?: boolean | null;

  Certification_Expires?: string /* ISO datetime */ | null;

  Form_Response_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Form_Responses.Form_Response_ID

  /**
   * Max length: 254 characters
   */
  Reference_Name?: string /* max 254 chars */ | null;
}

export type VwGccResponseRequirementsRecord = VwGccResponseRequirements;
