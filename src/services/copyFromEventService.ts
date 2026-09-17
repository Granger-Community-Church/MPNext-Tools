import { MPHelper } from '@/lib/providers/ministry-platform';
import { AuthorizationService } from '@/services/authorizationService';
import { MP_FETCH_BATCH_SIZE } from '@/lib/constants';
import { escapeFilterString, validatePositiveInt } from '@/lib/validation';
import { COPYABLE_FIELDS, EVENT_ROOM_COPY_COLUMNS, EventRoomCreateSchema, isCopyableTextField } from '@/lib/dto';
import { mergeText, mpDatetimeKey, pairKey, resolveOccurrences, toRoomCreate } from '@/lib/copy-from-event-utils';
import type {
  ApplyCopyPayload,
  ApplyCopyResult,
  CopyableField,
  EventFieldValues,
  EventRoomCreate,
  EventRoomRow,
  FieldCopyMode,
  OccurrenceCopyResult,
  SeriesOccurrence,
  SourceEventSearchResult,
} from '@/lib/dto';

// Every query below joins tables whose column names collide with the base table
// (Description, Congregation_ID, Group_ID, Notes, Closed, Cancelled, ...), so every
// base-table column is qualified. See CLAUDE.md "Disambiguate ambiguous columns".

const EVENT_FIELDS_SELECT = [
  'Events.Event_ID',
  'Events.Event_Title',
  'Events.Event_Start_Date',
  'Congregation_ID_TABLE.Congregation_Name',
  'Events.Meeting_Instructions',
  'Events.Description',
  'Events.Additional_Description',
  'Events.Online_Registration_Product',
  'Online_Registration_Product_TABLE.Product_Name',
  'Events.Registration_Form',
  'Registration_Form_TABLE.Form_Title',
  'Events.Registrant_Group',
  'Registrant_Group_TABLE.Group_Name',
].join(', ');

const EVENT_SEARCH_SELECT = [
  'Events.Event_ID',
  'Events.Event_Title',
  'Events.Event_Start_Date',
  'Congregation_ID_TABLE.Congregation_Name',
].join(', ');

const EVENT_ROOM_SELECT = [
  'Event_Rooms.Event_Room_ID',
  'Event_Rooms.Event_ID',
  'Event_Rooms.Room_ID',
  'Room_ID_TABLE.Room_Name',
  'Room_ID_TABLE_Building_ID_TABLE.Building_Name',
  'Event_Rooms.Group_ID',
  'Group_ID_TABLE.Group_Name',
  'Group_ID_TABLE_Congregation_ID_TABLE.Congregation_Name AS Group_Congregation_Name',
  'Event_Rooms.Room_Layout_ID',
  'Room_Layout_ID_TABLE.Layout_Name',
  ...EVENT_ROOM_COPY_COLUMNS.filter((c) => c !== 'Room_ID' && c !== 'Group_ID' && c !== 'Room_Layout_ID').map(
    (c) => `Event_Rooms.${c}`,
  ),
  'Event_Rooms.Cancelled',
].join(', ');

const SEARCH_TOP = 25;
const SERIES_PROC = 'api_Common_GetEventsInSeries';

/**
 * Every method gates, reads included (see .claude/references/security/README.md).
 * For writes, the gate's return value is the ONLY source of `$userId`.
 */
function requireAccess(
  table: string,
  operation: 'read' | 'create' | 'update' | 'delete',
): Promise<number> {
  return AuthorizationService.getInstance().requireSecurityRole({ table, operation });
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class CopyFromEventService {
  private static instance: CopyFromEventService;
  private mp: MPHelper;

  private constructor() {
    this.mp = new MPHelper();
  }

  public static async getInstance(): Promise<CopyFromEventService> {
    if (!CopyFromEventService.instance) {
      CopyFromEventService.instance = new CopyFromEventService();
    }
    return CopyFromEventService.instance;
  }

  // ---- Events -------------------------------------------------------------

  async getEventFieldValues(eventId: number): Promise<EventFieldValues | null> {
    await requireAccess('Events', 'read');
    validatePositiveInt(eventId);
    const rows = await this.mp.getTableRecords<EventFieldValues>({
      table: 'Events',
      select: EVENT_FIELDS_SELECT,
      filter: `Events.Event_ID = ${eventId}`,
      top: 1,
    });
    return rows[0] ?? null;
  }

  async getEventFieldValuesForIds(eventIds: number[]): Promise<EventFieldValues[]> {
    await requireAccess('Events', 'read');
    const results: EventFieldValues[] = [];
    for (const batch of chunk(eventIds, MP_FETCH_BATCH_SIZE)) {
      batch.forEach(validatePositiveInt);
      const rows = await this.mp.getTableRecords<EventFieldValues>({
        table: 'Events',
        select: EVENT_FIELDS_SELECT,
        filter: `Events.Event_ID IN (${batch.join(', ')})`,
      });
      results.push(...rows);
    }
    return results;
  }

  /**
   * All occurrences of the series the event belongs to (including the event
   * itself), sorted by start date. Empty for a standalone event. Series are
   * defined by dp_Sequences, which is not exposed through the tables API, so
   * this goes through the core MP procedure.
   */
  async getSeriesOccurrences(eventId: number): Promise<SeriesOccurrence[]> {
    await requireAccess('Events', 'read');
    validatePositiveInt(eventId);
    const result = await this.mp.executeProcedure(SERIES_PROC, { '@EventID': eventId });
    const rows = (result?.[0] ?? []) as Array<Record<string, unknown>>;
    return rows
      .map((row) => ({
        Event_ID: Number(row.Event_ID),
        Event_Title: String(row.Event_Title ?? ''),
        Event_Start_Date: String(row.Event_Start_Date ?? ''),
      }))
      .filter((occ) => Number.isFinite(occ.Event_ID) && occ.Event_ID > 0)
      .sort((a, b) => mpDatetimeKey(a.Event_Start_Date).localeCompare(mpDatetimeKey(b.Event_Start_Date)));
  }

  async searchEvents(opts: {
    term?: string;
    exactTitle?: string;
    excludeEventId: number;
    top?: number;
  }): Promise<SourceEventSearchResult[]> {
    await requireAccess('Events', 'read');
    validatePositiveInt(opts.excludeEventId);
    const conditions: string[] = [`Events.Event_ID <> ${opts.excludeEventId}`];

    if (opts.exactTitle !== undefined) {
      // Plain quote doubling: escapeFilterString's [_]/[%] rewriting is LIKE-only.
      conditions.push(`Events.Event_Title = '${opts.exactTitle.replace(/'/g, "''")}'`);
    } else if (opts.term !== undefined) {
      const term = opts.term.trim();
      if (term === '') return [];
      conditions.push(`Events.Event_Title LIKE '%${escapeFilterString(term)}%'`);
    } else {
      return [];
    }

    return this.mp.getTableRecords<SourceEventSearchResult>({
      table: 'Events',
      select: EVENT_SEARCH_SELECT,
      filter: conditions.join(' AND '),
      orderBy: 'Events.Event_Start_Date DESC',
      top: opts.top ?? SEARCH_TOP,
    });
  }

  /**
   * Non-cancelled room counts per event. An MP failure returns an empty map; an
   * unauthorized caller is refused before the try, never swallowed into it.
   */
  async getRoomCounts(eventIds: number[]): Promise<Map<number, number>> {
    await requireAccess('Event_Rooms', 'read');
    const counts = new Map<number, number>();
    if (eventIds.length === 0) return counts;
    try {
      for (const batch of chunk(eventIds, MP_FETCH_BATCH_SIZE)) {
        batch.forEach(validatePositiveInt);
        const rows = await this.mp.getTableRecords<{ Event_ID: number; Room_Count: number }>({
          table: 'Event_Rooms',
          select: 'Event_ID, COUNT(Event_Room_ID) AS Room_Count',
          filter: `Event_ID IN (${batch.join(', ')}) AND Cancelled = 0`,
          groupBy: 'Event_ID',
        });
        for (const row of rows) counts.set(row.Event_ID, row.Room_Count);
      }
    } catch (error) {
      console.warn('CopyFromEventService.getRoomCounts failed; continuing without counts:', errorMessage(error));
      return new Map();
    }
    return counts;
  }

  async attachRoomCounts(events: SourceEventSearchResult[]): Promise<SourceEventSearchResult[]> {
    const counts = await this.getRoomCounts(events.map((e) => e.Event_ID));
    return events.map((e) => ({ ...e, Room_Count: counts.get(e.Event_ID) ?? 0 }));
  }

  // ---- Event_Rooms ----------------------------------------------------------

  async getEventRooms(eventId: number, opts: { includeCancelled: boolean }): Promise<EventRoomRow[]> {
    await requireAccess('Event_Rooms', 'read');
    validatePositiveInt(eventId);
    const conditions = [`Event_Rooms.Event_ID = ${eventId}`];
    if (!opts.includeCancelled) conditions.push('Event_Rooms.Cancelled = 0');
    return this.mp.getTableRecords<EventRoomRow>({
      table: 'Event_Rooms',
      select: EVENT_ROOM_SELECT,
      filter: conditions.join(' AND '),
      orderBy: 'Room_ID_TABLE_Building_ID_TABLE.Building_Name, Room_ID_TABLE.Room_Name, Group_ID_TABLE.Group_Name',
    });
  }

  /** Keys (see `pairKey`) of every non-cancelled Room+Group pair on the given events. */
  async getExistingRoomPairs(eventIds: number[]): Promise<Set<string>> {
    await requireAccess('Event_Rooms', 'read');
    const pairs = new Set<string>();
    for (const batch of chunk(eventIds, MP_FETCH_BATCH_SIZE)) {
      batch.forEach(validatePositiveInt);
      const rows = await this.mp.getTableRecords<{ Event_ID: number; Room_ID: number; Group_ID: number | null }>({
        table: 'Event_Rooms',
        select: 'Event_ID, Room_ID, Group_ID',
        filter: `Event_ID IN (${batch.join(', ')}) AND Cancelled = 0`,
      });
      for (const row of rows) pairs.add(pairKey(row.Event_ID, row.Room_ID, row.Group_ID));
    }
    return pairs;
  }

  // ---- Writes ---------------------------------------------------------------

  async updateEventFields(
    eventId: number,
    patch: Partial<Record<CopyableField, string | number | null>>,
  ): Promise<void> {
    const $userId = await requireAccess('Events', 'update');
    // No schema: the generated EventsSchema predates this org's custom columns
    // (Additional_Description, Registrant_Group) and Zod would strip them.
    await this.mp.updateTableRecords('Events', [{ Event_ID: eventId, ...patch }], { $userId });
  }

  async createEventRooms(records: EventRoomCreate[]): Promise<void> {
    const $userId = await requireAccess('Event_Rooms', 'create');
    if (records.length === 0) return;
    await this.mp.createTableRecords('Event_Rooms', records, {
      schema: EventRoomCreateSchema,
      $userId,
    });
  }

  // ---- Orchestration --------------------------------------------------------

  async applyCopy(payload: ApplyCopyPayload): Promise<ApplyCopyResult> {
    await requireAccess('Events', 'update');
    validatePositiveInt(payload.targetEventId);
    validatePositiveInt(payload.sourceEventId);
    if (payload.targetEventId === payload.sourceEventId) {
      throw new Error('Source and target event must be different');
    }

    const [target, source] = await Promise.all([
      this.getEventFieldValues(payload.targetEventId),
      this.getEventFieldValues(payload.sourceEventId),
    ]);
    if (!target) throw new Error(`Target event ${payload.targetEventId} not found`);
    if (!source) throw new Error(`Source event ${payload.sourceEventId} not found`);

    // The server re-resolves the occurrence list; the client only sends a scope.
    const series = payload.scope === 'this' ? [] : await this.getSeriesOccurrences(target.Event_ID);
    const occurrences = resolveOccurrences(target, series, payload.scope);
    const occurrenceIds = occurrences.map((o) => o.Event_ID);

    const fieldEntries = Object.entries(payload.fields) as Array<[CopyableField, { mode: FieldCopyMode }]>;
    const wantsFields = fieldEntries.length > 0;

    // Validate room IDs against the source so a stale/foreign ID can't copy someone else's row.
    const requestedRoomIds = new Set(payload.sourceEventRoomIds);
    const sourceRooms: EventRoomRow[] = [];
    if (requestedRoomIds.size > 0) {
      const all = await this.getEventRooms(source.Event_ID, { includeCancelled: true });
      const seenPairs = new Set<string>();
      for (const row of all) {
        if (!requestedRoomIds.has(row.Event_Room_ID)) continue;
        const key = pairKey(0, row.Room_ID, row.Group_ID);
        if (seenPairs.has(key)) continue;
        seenPairs.add(key);
        sourceRooms.push(row);
      }
    }
    const wantsRooms = sourceRooms.length > 0;

    const currentByEventId = new Map<number, EventFieldValues>();
    if (wantsFields) {
      for (const row of await this.getEventFieldValuesForIds(occurrenceIds)) {
        currentByEventId.set(row.Event_ID, row);
      }
    }
    const existingPairs = wantsRooms ? await this.getExistingRoomPairs(occurrenceIds) : new Set<string>();

    const results: OccurrenceCopyResult[] = [];

    // Sequential on purpose: a hard failure should not fan out dozens of concurrent
    // writes, and the audit log stays in date order.
    for (const occurrence of occurrences) {
      const res: OccurrenceCopyResult = {
        Event_ID: occurrence.Event_ID,
        Event_Start_Date: occurrence.Event_Start_Date,
        fieldsUpdated: [],
        roomsCreated: 0,
        roomsSkipped: 0,
      };

      if (wantsFields) {
        try {
          const current = currentByEventId.get(occurrence.Event_ID);
          if (!current) throw new Error('Could not load current field values');
          const patch: Partial<Record<CopyableField, string | number | null>> = {};
          for (const [key, { mode }] of fieldEntries) {
            const def = COPYABLE_FIELDS.find((f) => f.key === key);
            if (!def) continue;
            let next: string | number | null;
            if (isCopyableTextField(key)) {
              next = mergeText(current[key], source[key], mode);
              if (typeof next === 'string' && def.maxLength && next.length > def.maxLength) {
                throw new Error(
                  `${def.label} would be ${next.length} characters; the limit is ${def.maxLength}`,
                );
              }
            } else {
              next = source[key];
            }
            if (next !== current[key]) {
              patch[key] = next;
              res.fieldsUpdated.push(key);
            }
          }
          if (res.fieldsUpdated.length > 0) {
            await this.updateEventFields(occurrence.Event_ID, patch);
          }
        } catch (error) {
          res.fieldsUpdated = [];
          res.fieldError = errorMessage(error);
        }
      }

      if (wantsRooms) {
        try {
          const toCreate: EventRoomCreate[] = [];
          for (const row of sourceRooms) {
            const key = pairKey(occurrence.Event_ID, row.Room_ID, row.Group_ID);
            if (existingPairs.has(key)) {
              res.roomsSkipped += 1;
              continue;
            }
            toCreate.push(toRoomCreate(row, occurrence.Event_ID));
            existingPairs.add(key);
          }
          if (toCreate.length > 0) {
            await this.createEventRooms(toCreate);
            res.roomsCreated = toCreate.length;
          }
        } catch (error) {
          res.roomsCreated = 0;
          res.roomError = errorMessage(error);
        }
      }

      results.push(res);
    }

    return {
      success: true,
      occurrences: results,
      summary: {
        occurrenceCount: results.length,
        fieldsUpdated: results.reduce((n, r) => n + r.fieldsUpdated.length, 0),
        roomsCreated: results.reduce((n, r) => n + r.roomsCreated, 0),
        roomsSkipped: results.reduce((n, r) => n + r.roomsSkipped, 0),
        failed: results.filter((r) => r.fieldError || r.roomError).length,
      },
    };
  }
}
