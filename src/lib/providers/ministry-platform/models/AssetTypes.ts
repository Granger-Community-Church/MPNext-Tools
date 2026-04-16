/**
 * Interface for Asset_Types
* Table: Asset_Types
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface AssetTypes {

  Asset_Type_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Asset_Type?: string /* max 50 chars */ | null;
}

export type AssetTypesRecord = AssetTypes;
