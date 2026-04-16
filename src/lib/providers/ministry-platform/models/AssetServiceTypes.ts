/**
 * Interface for Asset_Service_Types
* Table: Asset_Service_Types
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface AssetServiceTypes {

  Service_Type_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Service_Type: string /* max 50 chars */;
}

export type AssetServiceTypesRecord = AssetServiceTypes;
