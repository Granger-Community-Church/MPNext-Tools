/**
 * Interface for Bible_Types
* Table: Bible_Types
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface BibleTypes {

  Bible_Type_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Bible_Type: string /* max 50 chars */;
}

export type BibleTypesRecord = BibleTypes;
