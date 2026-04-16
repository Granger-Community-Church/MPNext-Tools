/**
 * Interface for Housing_Types
* Table: Housing_Types
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface HousingTypes {

  Housing_Type_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Housing_Type: string /* max 50 chars */;
}

export type HousingTypesRecord = HousingTypes;
