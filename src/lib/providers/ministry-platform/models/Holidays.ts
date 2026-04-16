/**
 * Interface for Holidays
* Table: Holidays
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface Holidays {

  Holiday_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Holiday: string /* max 50 chars */;
}

export type HolidaysRecord = Holidays;
