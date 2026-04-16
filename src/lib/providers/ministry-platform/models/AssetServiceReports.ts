/**
 * Interface for Asset_Service_Reports
* Table: Asset_Service_Reports
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface AssetServiceReports {

  Asset_Service_Report_ID: number /* 32-bit integer */; // Primary Key

  Asset_ID: number /* 32-bit integer */; // Foreign Key -> Assets.Asset_ID

  Service_Date?: string /* ISO date (YYYY-MM-DD) */ | null;

  Service_Type?: number /* 32-bit integer */ | null; // Foreign Key -> Asset_Service_Types.Service_Type_ID

  Labor_Cost: number /* currency amount */; // Has Default

  Parts_Cost: number /* currency amount */; // Has Default

  Serviced_By?: number /* 32-bit integer */ | null; // Foreign Key -> Contacts.Contact_ID

  Repair_Total?: number /* currency amount */ | null; // Read Only, Computed

  /**
   * Max length: 2000 characters
   */
  Notes?: string /* max 2000 chars */ | null;
}

export type AssetServiceReportsRecord = AssetServiceReports;
