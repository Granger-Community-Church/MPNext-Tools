/**
 * Interface for gcc_vw_core_individuals_dataset
* Table: gcc_vw_core_individuals_dataset
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface GccVwCoreIndividualsDataset {

  Contact_ID: number /* 32-bit integer */;

  Participant_ID?: number /* 32-bit integer */ | null;

  /**
   * Max length: 75 characters
   */
  Display_Name: string /* max 75 chars */;

  Age?: number /* 32-bit integer */ | null;

  /**
   * Max length: 25 characters
   */
  Gender?: string /* max 25 chars */ | null;

  /**
   * Max length: 25 characters
   */
  Marital_Status?: string /* max 25 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Participant_Type: string /* max 50 chars */;

  /**
   * Max length: 50 characters
   */
  Contact_Status: string /* max 50 chars */;

  /**
   * Max length: 50 characters
   */
  Member_Status?: string /* max 50 chars */ | null;

  Core_Class_101_Date?: string /* ISO datetime */ | null;

  Core_Class_201_Date?: string /* ISO datetime */ | null;

  Core_Class_301_Date?: string /* ISO datetime */ | null;

  Core_Class_401_Date?: string /* ISO datetime */ | null;
}

export type GccVwCoreIndividualsDatasetRecord = GccVwCoreIndividualsDataset;
