/**
 * Interface for vw_gcc_core_tracking
* Table: vw_gcc_core_tracking
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccCoreTracking {

  Contact_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 125 characters
   */
  Display_Name?: string /* max 125 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Nickname?: string /* max 50 chars */ | null;

  /**
   * Max length: 75 characters
   */
  Current_Core_Group: string /* max 75 chars */;

  Last_Date?: string /* ISO datetime */ | null;

  /**
   * Max length: 75 characters
   */
  Last_Event?: string /* max 75 chars */ | null;

  Next_Date?: string /* ISO datetime */ | null;

  /**
   * Max length: 75 characters
   */
  Next_Event?: string /* max 75 chars */ | null;

  Core_101_Grad?: string /* ISO datetime */ | null;

  Core_201_Grad?: string /* ISO datetime */ | null;

  Core_301_Grad?: string /* ISO datetime */ | null;

  Core_401_Grad?: string /* ISO datetime */ | null;

  Core_101_Covenant?: string /* ISO datetime */ | null;

  Core_201_Covenant?: string /* ISO datetime */ | null;

  Core_301_Covenant?: string /* ISO datetime */ | null;

  /**
   * Max length: 50 characters
   */
  Contact_Status: string /* max 50 chars */;

  /**
   * Max length: 50 characters
   */
  Participant_Type?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Member_Status?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Congregation_Name?: string /* max 50 chars */ | null;

  Group_Life: boolean;

  __Is_Serving: boolean;

  __Is_Leading: boolean;

  Last_HH_Donation?: string /* ISO datetime */ | null;

  Last_HH_Activity?: string /* ISO datetime */ | null;

  Current_Core_Group_ID?: number /* 32-bit integer */ | null;

  Current_Core_Group_Start_Date?: string /* ISO datetime */ | null;

  Current_Core_Group_End_Date?: string /* ISO datetime */ | null;

  Participant_ID: number /* 32-bit integer */;

  Congregation_ID?: number /* 32-bit integer */ | null;

  User_Account?: number /* 32-bit integer */ | null;
}

export type VwGccCoreTrackingRecord = VwGccCoreTracking;
