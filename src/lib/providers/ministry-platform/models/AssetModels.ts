/**
 * Interface for Asset_Models
* Table: Asset_Models
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface AssetModels {

  Asset_Model_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Model: string /* max 50 chars */;

  /**
   * Max length: 50 characters
   */
  Series?: string /* max 50 chars */ | null;

  Brand?: number /* 32-bit integer */ | null; // Foreign Key -> Asset_Vendors.Asset_Vendor_ID

  Type?: number /* 32-bit integer */ | null; // Foreign Key -> Asset_Types.Asset_Type_ID
}

export type AssetModelsRecord = AssetModels;
