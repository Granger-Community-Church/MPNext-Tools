/**
 * Interface for Media_Archive_Types
* Table: Media_Archive_Types
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface MediaArchiveTypes {

  Media_Type_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Media_Type?: string /* max 50 chars */ | null;
}

export type MediaArchiveTypesRecord = MediaArchiveTypes;
