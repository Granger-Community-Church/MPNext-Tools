/**
 * Interface for Event_Rooms
* Table: Event_Rooms
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface EventRooms {

  Event_Room_ID: number /* 32-bit integer */; // Primary Key

  Event_ID: number /* 32-bit integer */; // Foreign Key -> Events.Event_ID

  Room_ID: number /* 32-bit integer */; // Foreign Key -> Rooms.Room_ID

  Group_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Groups.Group_ID

  Default_Group_Room?: boolean | null;

  Balance_Priority: number /* 32-bit integer */; // Has Default

  Closed: boolean; // Has Default

  Auto_Close_At_Capacity: boolean; // Has Default

  Room_Layout_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Room_Layouts.Room_Layout_ID

  /**
   * Max length: 50 characters
   */
  Front_of_Room?: string /* max 50 chars */ | null;

  Chairs?: number /* 16-bit integer */ | null;

  Auditorium_Chairs?: number /* 32-bit integer */ | null;

  Round_Tables?: number /* 32-bit integer */ | null;

  Tables?: number /* 16-bit integer */ | null;

  Presenter_Tables?: number /* 32-bit integer */ | null;

  Presenter_Chairs?: number /* 32-bit integer */ | null;

  Power_Strips?: number /* 32-bit integer */ | null;

  Room_Occupied: boolean; // Has Default

  /**
   * Max length: 2147483647 characters
   */
  Notes?: string /* max 2147483647 chars */ | null;

  _Approved?: boolean | null; // Read Only

  _Tech_Approved?: boolean | null; // Read Only

  Cancelled: boolean; // Has Default

  _Reservation_Start?: string /* ISO datetime */ | null; // Read Only, Computed

  _Reservation_End?: string /* ISO datetime */ | null; // Read Only, Computed

  Checkin_Capacity?: number /* 32-bit integer */ | null;
}

export type EventRoomsRecord = EventRooms;
