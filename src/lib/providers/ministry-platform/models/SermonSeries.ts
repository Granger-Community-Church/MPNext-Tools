/**
 * Interface for Sermon_Series
* Table: Sermon_Series
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface SermonSeries {

  Sermon_Series_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 100 characters
   */
  Sermon_Series: string /* max 100 chars */;
}

export type SermonSeriesRecord = SermonSeries;
