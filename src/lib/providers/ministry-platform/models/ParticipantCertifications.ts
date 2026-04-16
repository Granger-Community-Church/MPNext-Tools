/**
 * Interface for Participant_Certifications
* Table: Participant_Certifications
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface ParticipantCertifications {

  Participant_Certification_ID: number /* 32-bit integer */; // Primary Key

  Participant_ID: number /* 32-bit integer */; // Foreign Key -> Participants.Participant_ID

  Certification_Type_ID: number /* 32-bit integer */; // Foreign Key -> Certification_Types.Certification_Type_ID

  Certification_Submitted: string /* ISO datetime */;

  Certification_Completed?: string /* ISO datetime */ | null;

  Passed?: boolean | null;

  Certification_Expires?: string /* ISO datetime */ | null;

  Certification_GUID: string /* GUID/UUID */; // Has Default

  /**
   * Max length: 500 characters
   */
  Notes?: string /* max 500 chars */ | null;

  /**
   * Max length: 254 characters
   */
  Reference_Name?: string /* max 254 chars */ | null;

  /**
   * Max length: 254 characters
   */
  Reference_Email?: string /* max 254 chars */ | null;

  Reference_Release?: number /* 32-bit integer */ | null; // Foreign Key -> Form_Responses.Form_Response_ID

  Message_Recipient?: number /* 32-bit integer */ | null; // Foreign Key -> dp_Communication_Messages.Communication_Message_ID

  Message_Template?: number /* 32-bit integer */ | null; // Foreign Key -> dp_Communication_Templates.Communication_Template_ID

  Form_Response_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Form_Responses.Form_Response_ID
}

export type ParticipantCertificationsRecord = ParticipantCertifications;
