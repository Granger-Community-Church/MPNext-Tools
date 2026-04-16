/**
 * Interface for Media_Archive_Categories
* Table: Media_Archive_Categories
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface MediaArchiveCategories {

  Media_Category_ID: number /* 32-bit integer */;

  /**
   * Max length: 50 characters
   */
  Category_Name: string /* max 50 chars */;
}

export type MediaArchiveCategoriesRecord = MediaArchiveCategories;
