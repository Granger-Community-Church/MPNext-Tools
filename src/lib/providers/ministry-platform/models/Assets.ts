/**
 * Interface for Assets
* Table: Assets
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface Assets {

  Asset_ID: number /* 32-bit integer */; // Primary Key

  Owner?: number /* 32-bit integer */ | null; // Foreign Key -> Contacts.Contact_ID

  /**
   * Max length: 100 characters
   */
  Nickname?: string /* max 100 chars */ | null;

  Department?: number /* 32-bit integer */ | null; // Foreign Key -> Ministries.Ministry_ID

  /**
   * Max length: 50 characters
   */
  Serial_Number?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Asset_Number?: string /* max 50 chars */ | null;

  Model?: number /* 32-bit integer */ | null; // Foreign Key -> Asset_Models.Asset_Model_ID

  /**
   * Max length: 2000 characters
   */
  Notes?: string /* max 2000 chars */ | null;

  Date_Retired?: string /* ISO datetime */ | null;

  Purchase_Date?: string /* ISO datetime */ | null;

  Purchase_Price: number /* currency amount */; // Has Default

  Warranty_Price: number /* currency amount */; // Has Default

  Total_Cost?: number /* currency amount */ | null; // Read Only, Computed

  TechOps_Purchase?: boolean | null;

  /**
   * Max length: 50 characters
   */
  Order_Number?: string /* max 50 chars */ | null;

  Vendor?: number /* 32-bit integer */ | null; // Foreign Key -> Asset_Vendors.Asset_Vendor_ID

  Warranty_End_Date?: string /* ISO date (YYYY-MM-DD) */ | null;

  Refurbished?: boolean | null;

  /**
   * Max length: 50 characters
   */
  Processor?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  HDD_Size?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  RAM?: string /* max 50 chars */ | null;
}

export type AssetsRecord = Assets;
