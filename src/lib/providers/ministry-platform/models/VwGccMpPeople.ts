/**
 * Interface for vw_gcc_mp_people
* Table: vw_gcc_mp_people
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccMpPeople {

  Contact_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 125 characters
   */
  Display_Name?: string /* max 125 chars */ | null;

  /**
   * Max length: 50 characters
   */
  First_Name?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Last_Name?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Nickname?: string /* max 50 chars */ | null;

  Age?: number /* 32-bit integer */ | null;

  Date_of_Birth?: string /* ISO date (YYYY-MM-DD) */ | null;

  /**
   * Max length: 30 characters
   */
  Birth_Month?: string /* max 30 chars */ | null;

  Gender_ID?: number /* 32-bit integer */ | null;

  /**
   * Max length: 25 characters
   */
  Gender?: string /* max 25 chars */ | null;

  Marital_Status_ID?: number /* 32-bit integer */ | null;

  /**
   * Max length: 25 characters
   */
  Marital_Status?: string /* max 25 chars */ | null;

  Household_Position_ID?: number /* 32-bit integer */ | null;

  /**
   * Max length: 25 characters
   */
  Household_Position?: string /* max 25 chars */ | null;

  /**
   * Max length: 75 characters
   */
  Current_School?: string /* max 75 chars */ | null;

  HS_Graduation_Year?: number /* 16-bit integer */ | null;

  /**
   * Max length: 25 characters
   */
  Mobile_Phone?: string /* max 25 chars */ | null;

  /**
   * Max length: 254 characters
   */
  Email_Address?: string /* email, max 254 chars */ | null;

  Bulk_Email_Opt_Out: boolean;

  /**
   * Max length: 25 characters
   */
  Home_Phone?: string /* max 25 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Congregation_Name?: string /* max 50 chars */ | null;

  household_ID?: number /* 32-bit integer */ | null;

  /**
   * Max length: 50 characters
   */
  Spouse_Nickname?: string /* max 50 chars */ | null;

  Spouse_Contact_ID?: number /* 32-bit integer */ | null;

  Family_Size?: number /* 32-bit integer */ | null;

  Minor_Children?: number /* 32-bit integer */ | null;

  Children_13_to_18?: number /* 32-bit integer */ | null;

  Children_Under_12?: number /* 32-bit integer */ | null;

  Young_Family?: boolean | null;

  Head_Over_35?: boolean | null;

  /**
   * Max length: 16 characters
   */
  Children_Category: string /* max 16 chars */;

  Address_ID?: number /* 32-bit integer */ | null;

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

  Driving_Distance?: number /* decimal */ | null;

  Driving_Time?: number /* decimal */ | null;

  /**
   * Max length: 15 characters
   */
  Latitude?: string /* max 15 chars */ | null;

  /**
   * Max length: 15 characters
   */
  Longitude?: string /* max 15 chars */ | null;

  Bulk_Mail_Opt_Out?: boolean | null;

  /**
   * Max length: 50 characters
   */
  Household_Source?: string /* max 50 chars */ | null;

  Donor_ID?: number /* 32-bit integer */ | null;

  First_HH_Donation?: string /* ISO datetime */ | null;

  Last_HH_Donation?: string /* ISO datetime */ | null;

  Donor_Record?: number /* 32-bit integer */ | null;

  Participant_ID?: number /* 32-bit integer */ | null;

  Contact_Status_ID: number /* 32-bit integer */;

  /**
   * Max length: 50 characters
   */
  Contact_Status?: string /* max 50 chars */ | null;

  Contact_End_Date?: string /* ISO date (YYYY-MM-DD) */ | null;

  Participant_Type_ID?: number /* 32-bit integer */ | null;

  /**
   * Max length: 50 characters
   */
  Participant_Type?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Engagement_Level?: string /* max 50 chars */ | null;

  Participant_Start_Date?: string /* ISO datetime */ | null;

  Participant_End_Date?: string /* ISO datetime */ | null;

  /**
   * Max length: 50 characters
   */
  Member_Status?: string /* max 50 chars */ | null;

  Group_Life?: boolean | null;

  Leading?: boolean | null;

  Serving?: boolean | null;

  Recent_Events?: number /* 32-bit integer */ | null;

  /**
   * Max length: 50 characters
   */
  _Background_Check_Status?: string /* max 50 chars */ | null; // Read Only

  /**
   * Max length: 128 characters
   */
  _Background_Check_Type?: string /* max 128 chars */ | null; // Read Only

  _Background_Check_Date?: string /* ISO datetime */ | null; // Read Only

  _First_Attendance_Ever?: string /* ISO datetime */ | null; // Read Only

  _Second_Attendance_Ever?: string /* ISO datetime */ | null; // Read Only

  _Third_Attendance_Ever?: string /* ISO datetime */ | null; // Read Only

  _Last_Attendance_Ever?: string /* ISO datetime */ | null; // Read Only

  Core_Class_101_Date?: string /* ISO datetime */ | null;

  Core_Class_201_Date?: string /* ISO datetime */ | null;

  Core_Class_301_Date?: string /* ISO datetime */ | null;

  Core_Class_401_Date?: string /* ISO datetime */ | null;

  Core_101_Graduate?: string /* ISO datetime */ | null;

  Core_201_Graduate?: string /* ISO datetime */ | null;

  Core_301_Graduate?: string /* ISO datetime */ | null;

  Core_401_Graduate?: string /* ISO datetime */ | null;

  I_Am_Committed?: string /* ISO datetime */ | null;

  Membership?: string /* ISO datetime */ | null;

  Membership_Years?: number /* 32-bit integer */ | null;

  SHAPE_Covenant?: string /* ISO datetime */ | null;

  Disciple?: string /* ISO datetime */ | null;

  Baptism?: string /* ISO datetime */ | null;

  Child_Dedication?: string /* ISO datetime */ | null;

  Smooth_Stone_Award?: string /* ISO datetime */ | null;

  /**
   * Max length: 16 characters
   */
  Employee?: string /* max 16 chars */ | null;
}

export type VwGccMpPeopleRecord = VwGccMpPeople;
