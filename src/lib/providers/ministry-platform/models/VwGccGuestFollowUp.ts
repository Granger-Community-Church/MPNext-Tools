/**
 * Interface for vw_gcc_guest_follow_up
* Table: vw_gcc_guest_follow_up
 * Access Level: Read
 * Special Permissions: DataExport
 * Generated from column metadata
 */
export interface VwGccGuestFollowUp {

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
   * Max length: 254 characters
   */
  Email_Address?: string /* email, max 254 chars */ | null;

  /**
   * Max length: 25 characters
   */
  Mobile_Phone?: string /* max 25 chars */ | null;

  /**
   * Max length: 25 characters
   */
  Gender?: string /* max 25 chars */ | null;

  Age?: number /* 32-bit integer */ | null;

  Participant_Start_Date?: string /* ISO date (YYYY-MM-DD) */ | null;

  /**
   * Max length: 50 characters
   */
  Participant_Type: string /* max 50 chars */;

  First_Time_Guest_Response?: string /* ISO datetime */ | null;

  Decision_For_Christ?: string /* ISO datetime */ | null;

  /**
   * Max length: 50 characters
   */
  Follow_Up_Status: string /* max 50 chars */;

  /**
   * Max length: 50 characters
   */
  Spouse_Nickname?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Spouse_Lastname?: string /* max 50 chars */ | null;

  Spouse_Age?: number /* 32-bit integer */ | null;

  /**
   * Max length: 25 characters
   */
  Spouse_Mobile?: string /* max 25 chars */ | null;

  /**
   * Max length: 254 characters
   */
  Spouse_Email?: string /* email, max 254 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Last_Card_Date?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Last_Email_Date?: string /* max 4000 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Last_Phone_Call_Date?: string /* max 4000 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Congregation_Name?: string /* max 50 chars */ | null;

  /**
   * Max length: 25 characters
   */
  Home_Phone?: string /* max 25 chars */ | null;

  /**
   * Max length: 75 characters
   */
  Address_Line_1?: string /* max 75 chars */ | null;

  /**
   * Max length: 75 characters
   */
  Address_Line_2?: string /* max 75 chars */ | null;

  /**
   * Max length: 50 characters
   */
  City?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  "State/Region"?: string /* max 50 chars */ | null;

  /**
   * Max length: 15 characters
   */
  Postal_Code?: string /* max 15 chars */ | null;

  Congregation_ID?: number /* 32-bit integer */ | null;

  Household_ID: number /* 32-bit integer */;

  Participant_ID: number /* 32-bit integer */;

  Follow_Up_Status_ID?: number /* 32-bit integer */ | null;
}

export type VwGccGuestFollowUpRecord = VwGccGuestFollowUp;
