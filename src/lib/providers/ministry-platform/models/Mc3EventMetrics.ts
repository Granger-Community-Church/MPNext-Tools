/**
 * Interface for _MC3_Event_Metrics
* Table: _MC3_Event_Metrics
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface Mc3EventMetrics {

  Event_Start_Date?: string /* ISO date (YYYY-MM-DD) */ | null;

  /**
   * Max length: 255 characters
   */
  Event_Title?: string /* max 255 chars */ | null;

  Breakfast_Plates?: number /* 32-bit integer */ | null;

  Lunch_Plates?: number /* 32-bit integer */ | null;

  Headcount?: number /* 32-bit integer */ | null;
}

export type Mc3EventMetricsRecord = Mc3EventMetrics;
