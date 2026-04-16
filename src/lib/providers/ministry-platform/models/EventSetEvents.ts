/**
 * Interface for Event_Set_Events
* Table: Event_Set_Events
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface EventSetEvents {

  Event_Set_Event_ID: number /* 32-bit integer */; // Primary Key

  Event_Set_ID: number /* 32-bit integer */; // Foreign Key -> Event_Sets.Event_Set_ID

  Event_ID: number /* 32-bit integer */; // Foreign Key -> Events.Event_ID

  Order: number /* 32-bit integer */;

  Days_Offset: number /* 32-bit integer */; // Has Default
}

export type EventSetEventsRecord = EventSetEvents;
