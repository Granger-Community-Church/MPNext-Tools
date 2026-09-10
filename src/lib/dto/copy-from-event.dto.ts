import { z } from 'zod';

/**
 * DTOs for the Copy From Event tool.
 *
 * The tool copies selected `Events` fields and `Event_Rooms` rows from a
 * "source" event onto an existing "target" event (and, optionally, the other
 * occurrences of the target's series). It never creates events.
 */

// ---------------------------------------------------------------------------
// Copyable Events fields
// ---------------------------------------------------------------------------

export type CopyableTextField = 'Meeting_Instructions' | 'Description' | 'Additional_Description';
export type CopyableFkField = 'Online_Registration_Product' | 'Registration_Form' | 'Registrant_Group';
export type CopyableField = CopyableTextField | CopyableFkField;

export type FkNameKey = 'Product_Name' | 'Form_Title' | 'Group_Name';

export interface CopyableFieldDef {
  key: CopyableField;
  label: string;
  kind: 'text' | 'fk';
  /** MP column size for bounded nvarchar fields; undefined for `text` columns. */
  maxLength?: number;
  /** For FK fields: the `EventFieldValues` key holding the linked record's display name. */
  nameKey?: FkNameKey;
}

export const COPYABLE_FIELDS: readonly CopyableFieldDef[] = [
  { key: 'Meeting_Instructions', label: 'Meeting Instructions', kind: 'text', maxLength: 4000 },
  { key: 'Description', label: 'Description', kind: 'text', maxLength: 2000 },
  { key: 'Additional_Description', label: 'Additional Description', kind: 'text' },
  { key: 'Online_Registration_Product', label: 'Online Registration Product', kind: 'fk', nameKey: 'Product_Name' },
  { key: 'Registration_Form', label: 'Registration Form', kind: 'fk', nameKey: 'Form_Title' },
  { key: 'Registrant_Group', label: 'Registrant Group', kind: 'fk', nameKey: 'Group_Name' },
];

export function isCopyableTextField(key: CopyableField): key is CopyableTextField {
  return COPYABLE_FIELDS.some((f) => f.key === key && f.kind === 'text');
}

/** An event with the six copyable fields plus display names for the FK fields. */
export interface EventFieldValues {
  Event_ID: number;
  Event_Title: string;
  Event_Start_Date: string;
  Congregation_Name: string | null;
  Meeting_Instructions: string | null;
  Description: string | null;
  Additional_Description: string | null;
  Online_Registration_Product: number | null;
  Product_Name: string | null;
  Registration_Form: number | null;
  Form_Title: string | null;
  Registrant_Group: number | null;
  Group_Name: string | null;
}

// ---------------------------------------------------------------------------
// Source search and series
// ---------------------------------------------------------------------------

export interface SourceEventSearchResult {
  Event_ID: number;
  Event_Title: string;
  Event_Start_Date: string;
  Congregation_Name: string | null;
  /** Non-cancelled `Event_Rooms` rows on the event; undefined if the count lookup failed. */
  Room_Count?: number;
}

export interface SeriesOccurrence {
  Event_ID: number;
  Event_Title: string;
  Event_Start_Date: string;
}

/**
 * Which occurrences of the target's series receive the copy.
 * - `this`: only the launched event
 * - `future`: the launched event and every occurrence starting on or after it
 * - `all`: every occurrence in the series
 */
export type SeriesScope = 'this' | 'future' | 'all';

// ---------------------------------------------------------------------------
// Event_Rooms
// ---------------------------------------------------------------------------

/**
 * Columns copied verbatim from a source `Event_Rooms` row to the new row.
 * Excludes the PK, `Event_ID` (set to the target), `Cancelled` (always false),
 * and the read-only/computed columns `_Approved`, `_Tech_Approved`,
 * `_Reservation_Start`, `_Reservation_End`.
 */
export const EVENT_ROOM_COPY_COLUMNS = [
  'Room_ID',
  'Group_ID',
  'Default_Group_Room',
  'Balance_Priority',
  'Closed',
  'Auto_Close_At_Capacity',
  'Room_Layout_ID',
  'Front_of_Room',
  'Chairs',
  'Auditorium_Chairs',
  'Round_Tables',
  'Tables',
  'Presenter_Tables',
  'Presenter_Chairs',
  'Power_Strips',
  'Room_Occupied',
  'Notes',
  'Checkin_Capacity',
] as const;

export type EventRoomCopyColumn = (typeof EVENT_ROOM_COPY_COLUMNS)[number];

/** An `Event_Rooms` row with display names for Room, Building, Group, and Layout. */
export interface EventRoomRow {
  Event_Room_ID: number;
  Event_ID: number;
  Room_ID: number;
  Room_Name: string;
  Building_Name: string | null;
  Group_ID: number | null;
  Group_Name: string | null;
  Room_Layout_ID: number | null;
  Layout_Name: string | null;
  Default_Group_Room: boolean | null;
  Balance_Priority: number;
  Closed: boolean;
  Auto_Close_At_Capacity: boolean;
  Front_of_Room: string | null;
  Chairs: number | null;
  Auditorium_Chairs: number | null;
  Round_Tables: number | null;
  Tables: number | null;
  Presenter_Tables: number | null;
  Presenter_Chairs: number | null;
  Power_Strips: number | null;
  Room_Occupied: boolean;
  Notes: string | null;
  Checkin_Capacity: number | null;
  Cancelled: boolean;
}

export type EventRoomCreate = { Event_ID: number; Cancelled: false } & Pick<
  EventRoomRow,
  EventRoomCopyColumn
>;

/**
 * Hand-written create schema for `Event_Rooms`.
 *
 * The generated `EventRoomsSchema` cannot be used here: it was generated from a
 * domain without this org's custom columns (`Front_of_Room`, `Auditorium_Chairs`,
 * `Round_Tables`, `Presenter_Tables`, `Presenter_Chairs`, `Power_Strips`,
 * `Room_Occupied`), and Zod strips unknown keys on parse, so those values would
 * be silently dropped. It also requires `Event_Room_ID`, which a create must omit.
 */
export const EventRoomCreateSchema = z.object({
  Event_ID: z.number().int().positive(),
  Room_ID: z.number().int().positive(),
  Group_ID: z.number().int().nullable(),
  Default_Group_Room: z.boolean().nullable(),
  Balance_Priority: z.number().int(),
  Closed: z.boolean(),
  Auto_Close_At_Capacity: z.boolean(),
  Room_Layout_ID: z.number().int().nullable(),
  Front_of_Room: z.string().max(50).nullable(),
  Chairs: z.number().int().nullable(),
  Auditorium_Chairs: z.number().int().nullable(),
  Round_Tables: z.number().int().nullable(),
  Tables: z.number().int().nullable(),
  Presenter_Tables: z.number().int().nullable(),
  Presenter_Chairs: z.number().int().nullable(),
  Power_Strips: z.number().int().nullable(),
  Room_Occupied: z.boolean(),
  Notes: z.string().nullable(),
  Checkin_Capacity: z.number().int().nullable(),
  Cancelled: z.literal(false),
});

// ---------------------------------------------------------------------------
// Selection state and apply payload / result
// ---------------------------------------------------------------------------

export type FieldCopyMode = 'overwrite' | 'append';

export interface FieldSelection {
  enabled: boolean;
  /** Only meaningful for text fields. */
  append: boolean;
}

export type FieldSelectionMap = Record<CopyableField, FieldSelection>;

export function emptyFieldSelections(): FieldSelectionMap {
  return {
    Meeting_Instructions: { enabled: false, append: false },
    Description: { enabled: false, append: false },
    Additional_Description: { enabled: false, append: false },
    Online_Registration_Product: { enabled: false, append: false },
    Registration_Form: { enabled: false, append: false },
    Registrant_Group: { enabled: false, append: false },
  };
}

export interface ApplyCopyPayload {
  targetEventId: number;
  sourceEventId: number;
  scope: SeriesScope;
  /** Only enabled fields are present. */
  fields: Partial<Record<CopyableField, { mode: FieldCopyMode }>>;
  /** `Event_Room_ID`s on the source event to copy. */
  sourceEventRoomIds: number[];
}

export interface OccurrenceCopyResult {
  Event_ID: number;
  Event_Start_Date: string;
  fieldsUpdated: CopyableField[];
  roomsCreated: number;
  roomsSkipped: number;
  fieldError?: string;
  roomError?: string;
}

export interface ApplyCopyResult {
  success: true;
  occurrences: OccurrenceCopyResult[];
  summary: {
    occurrenceCount: number;
    fieldsUpdated: number;
    roomsCreated: number;
    roomsSkipped: number;
    failed: number;
  };
}

export type ApplyCopyResponse = ApplyCopyResult | { success: false; error: string };
