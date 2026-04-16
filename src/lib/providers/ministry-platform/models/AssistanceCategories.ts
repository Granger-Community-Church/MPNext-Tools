/**
 * Interface for Assistance_Categories
* Table: Assistance_Categories
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface AssistanceCategories {

  Assistance_Category_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Assistance_Category: string /* max 50 chars */;

  Review_Months?: number /* 32-bit integer */ | null;

  /**
   * Max length: 500 characters
   */
  Description?: string /* max 500 chars */ | null;
}

export type AssistanceCategoriesRecord = AssistanceCategories;
