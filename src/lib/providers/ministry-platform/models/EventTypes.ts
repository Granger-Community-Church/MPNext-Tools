/**
 * Interface for Event_Types
* Table: Event_Types
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface EventTypes {

  Event_Type_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Event_Type: string /* max 50 chars */;

  /**
   * Max length: 255 characters
   */
  Description?: string /* max 255 chars */ | null;

  Required_Event_Type?: number /* 32-bit integer */ | null; // Foreign Key -> Event_Types.Event_Type_ID

  Milestone?: number /* 32-bit integer */ | null; // Foreign Key -> Milestones.Milestone_ID

  Omit_From_Engagement_Attendance: boolean; // Has Default

  /**
   * Max length: 25 characters
   */
  Color?: string /* max 25 chars */ | null;

  Show_On_MPMobile: boolean; // Has Default

  Public_By_Default: boolean; // Has Default

  Auto_Approve?: boolean | null; // Has Default

  Show_In_Picklist?: boolean | null;

  Auto_Close_Registrations: boolean; // Has Default

  Promote_Additional_Dates: boolean; // Has Default
}

export type EventTypesRecord = EventTypes;
