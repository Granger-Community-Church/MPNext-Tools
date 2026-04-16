/**
 * Interface for vw_gcc_last_core_attendances
* Table: vw_gcc_last_core_attendances
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccLastCoreAttendances {

  Contact_ID: number /* 32-bit integer */;

  Participant_ID?: number /* 32-bit integer */ | null;

  /**
   * Max length: 125 characters
   */
  Display_Name?: string /* max 125 chars */ | null;

  User_Account?: number /* 32-bit integer */ | null;

  Core_Class_101_Date?: string /* ISO datetime */ | null;

  Core_Class_201_Date?: string /* ISO datetime */ | null;

  Core_Class_301_Date?: string /* ISO datetime */ | null;

  Core_Class_401_Date?: string /* ISO datetime */ | null;

  Training_101_1_Date?: string /* ISO datetime */ | null;

  Training_101_2_Date?: string /* ISO datetime */ | null;

  Training_101_3_Date?: string /* ISO datetime */ | null;

  Training_101_4_Date?: string /* ISO datetime */ | null;

  Training_101_5_Date?: string /* ISO datetime */ | null;

  Training_201_1_Date?: string /* ISO datetime */ | null;

  Training_201_2_Date?: string /* ISO datetime */ | null;

  Training_201_3_Date?: string /* ISO datetime */ | null;

  Training_201_4_Date?: string /* ISO datetime */ | null;

  Training_201_5_Date?: string /* ISO datetime */ | null;

  Training_301_1_Date?: string /* ISO datetime */ | null;

  Training_301_2_Date?: string /* ISO datetime */ | null;

  Training_301_3_Date?: string /* ISO datetime */ | null;

  Training_301_4_Date?: string /* ISO datetime */ | null;

  Training_301_5_Date?: string /* ISO datetime */ | null;

  Training_401_1_Date?: string /* ISO datetime */ | null;

  Training_401_2_Date?: string /* ISO datetime */ | null;

  Training_401_3_Date?: string /* ISO datetime */ | null;

  Training_401_4_Date?: string /* ISO datetime */ | null;
}

export type VwGccLastCoreAttendancesRecord = VwGccLastCoreAttendances;
