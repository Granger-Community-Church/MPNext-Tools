/**
 * Interface for Asset_Vendors
* Table: Asset_Vendors
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface AssetVendors {

  Asset_Vendor_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Asset_Vendor: string /* max 50 chars */;
}

export type AssetVendorsRecord = AssetVendors;
