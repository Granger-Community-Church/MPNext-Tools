/**
 * Interface for Congregation_Reports
* Table: Congregation_Reports
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface CongregationReports {

  Congregation_Report_ID: number /* 32-bit integer */; // Primary Key

  Congregation_ID: number /* 32-bit integer */; // Foreign Key -> Congregations.Congregation_ID

  Period_Start?: string /* ISO datetime */ | null;

  Period_End?: string /* ISO datetime */ | null;

  Service_Number?: number /* 32-bit integer */ | null;

  Event_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Events.Event_ID

  Holiday_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Holidays.Holiday_ID

  Speaker?: number /* 32-bit integer */ | null; // Foreign Key -> Contacts.Contact_ID

  Sermon_Series_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Sermon_Series.Sermon_Series_ID

  /**
   * Max length: 100 characters
   */
  Sermon_Title?: string /* max 100 chars */ | null;

  Auditorium?: number /* 32-bit integer */ | null;

  Child_Attendance?: number /* 32-bit integer */ | null;

  Online_Attendance?: number /* 32-bit integer */ | null;

  HS_Attendance?: number /* 32-bit integer */ | null;

  MS_Attendance?: number /* 32-bit integer */ | null;

  Volunteer_Attendance?: number /* 32-bit integer */ | null;

  General_Fund?: number /* currency amount */ | null;

  Building_Fund?: number /* currency amount */ | null;

  Digital_Giving_GF?: number /* currency amount */ | null;

  Missions_Fund?: number /* currency amount */ | null;

  Christmas?: number /* currency amount */ | null;

  Budget_Goal?: number /* currency amount */ | null;

  New_Donors_Num?: number /* 32-bit integer */ | null;

  New_Donor_Amt?: number /* currency amount */ | null;

  PayPal_GF?: number /* currency amount */ | null;

  Bookstore?: number /* currency amount */ | null;

  Cafe?: number /* currency amount */ | null;

  Message_Sales?: number /* currency amount */ | null;
}

export type CongregationReportsRecord = CongregationReports;
