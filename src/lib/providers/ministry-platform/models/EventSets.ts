/**
 * Interface for Event_Sets
* Table: Event_Sets
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface EventSets {

  Event_Set_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 75 characters
   */
  Event_Set: string /* max 75 chars */;

  /**
   * Max length: 255 characters
   */
  Description?: string /* max 255 chars */ | null;

  Active?: boolean | null;
}

export type EventSetsRecord = EventSets;
