/**
 * Interface for Tell_Us_More
* Table: Tell_Us_More
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface TellUsMore {

  Tell_Us_More_ID: number /* 32-bit integer */; // Primary Key

  Submitted_Date?: string /* ISO date (YYYY-MM-DD) */ | null;

  Submitted_Time?: string /* ISO time (HH:MM:SS) */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Church_Relationship?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Attendance_Frequency?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Attendance_Type?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Marital_Status?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Child_Age_Ranges?: string /* max 2147483647 chars */ | null;

  Children_Infant: boolean; // Has Default

  Children_Preschool: boolean; // Has Default

  Children_Elementary: boolean; // Has Default

  Children_Middle_School: boolean; // Has Default

  Children_High_School: boolean; // Has Default

  Children_19_to_25: boolean; // Has Default

  Children_Over_25: boolean; // Has Default

  Children_No: boolean; // Has Default

  /**
   * Max length: 2147483647 characters
   */
  Birth_Year?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Postal_Code?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Gender?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  GCC_Source?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Friend_Invite_Conditions?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Guidance_From_God?: string /* max 2147483647 chars */ | null;

  Guidance_Work: boolean; // Has Default

  Guidance_Parenting: boolean; // Has Default

  Guidance_School: boolean; // Has Default

  Guidance_Marriage: boolean; // Has Default

  Guidance_Finances: boolean; // Has Default

  Guidance_Fun: boolean; // Has Default

  Guidance_Relationships: boolean; // Has Default

  Guidance_Boundaries: boolean; // Has Default

  Guidance_Purpose: boolean; // Has Default

  /**
   * Max length: 2147483647 characters
   */
  Guidance_Other?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Generosity?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Generosity_Stoppers?: string /* max 2147483647 chars */ | null;

  Generosity_Stopper_Vision: boolean; // Has Default

  Generosity_Stopper_Accountability: boolean; // Has Default

  Generosity_Stopper_Options: boolean; // Has Default

  Generosity_Stopper_Learn: boolean; // Has Default

  Generosity_Stopper_Income: boolean; // Has Default

  /**
   * Max length: 2147483647 characters
   */
  Engagement?: string /* max 2147483647 chars */ | null;

  Engagement_Not_Regular: boolean; // Has Default

  Engagement_Attends_No_Commitment: boolean; // Has Default

  Engagement_Committed_Baptized: boolean; // Has Default

  Engagement_Contributes: boolean; // Has Default

  Engagement_Makes_Disciples: boolean; // Has Default

  /**
   * Max length: 2147483647 characters
   */
  Engagement_Stoppers?: string /* max 2147483647 chars */ | null;

  Engagement_Stopper_Family: boolean; // Has Default

  Engagement_Stopper_Work: boolean; // Has Default

  Engagement_Stopper_Finances: boolean; // Has Default

  Engagement_Stopper_Not_Worth_TEAM: boolean; // Has Default

  Engagement_Stopper_Skeptical: boolean; // Has Default

  Engagement_Stopper_No_Desire: boolean; // Has Default

  /**
   * Max length: 2147483647 characters
   */
  Engagement_Stoppers_Other?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Faith_Growth_Areas?: string /* max 2147483647 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Hope_For_Michiana?: string /* max 2147483647 chars */ | null;
}

export type TellUsMoreRecord = TellUsMore;
