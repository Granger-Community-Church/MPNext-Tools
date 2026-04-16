/**
 * Interface for MC3_Assessments
* Table: MC3_Assessments
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface Mc3Assessments {

  MC3_Assessment_ID: number /* 32-bit integer */; // Primary Key

  Participant_ID: number /* 32-bit integer */; // Foreign Key -> Participants.Participant_ID

  Assessment_Date: string /* ISO date (YYYY-MM-DD) */;

  Housing_Type_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Housing_Types.Housing_Type_ID

  Years_at_Current_Residence: number /* 32-bit integer */; // Has Default

  /**
   * Max length: 2000 characters
   */
  Landlord_Contact_Information?: string /* max 2000 chars */ | null;
}

export type Mc3AssessmentsRecord = Mc3Assessments;
