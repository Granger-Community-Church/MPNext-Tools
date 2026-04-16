/**
 * Interface for Incident_Reports
* Table: Incident_Reports
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface IncidentReports {

  Incident_Report_ID: number /* 32-bit integer */; // Primary Key

  Incident_Date: string /* ISO datetime */;

  Incident_End_Date?: string /* ISO datetime */ | null;

  Involved_Contact_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Contacts.Contact_ID

  Reporting_Party_Contact_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Contacts.Contact_ID

  /**
   * Max length: 250 characters
   */
  Incident_Location?: string /* max 250 chars */ | null;

  Incident_Type?: number /* 32-bit integer */ | null; // Foreign Key -> Incident_Types.Incident_Type_ID

  Department?: number /* 32-bit integer */ | null; // Foreign Key -> Ministries.Ministry_ID

  Room?: number /* 32-bit integer */ | null; // Foreign Key -> Rooms.Room_ID

  /**
   * Max length: 500 characters
   */
  Other_Involved_Parties?: string /* max 500 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Notes?: string /* max 4000 chars */ | null;
}

export type IncidentReportsRecord = IncidentReports;
