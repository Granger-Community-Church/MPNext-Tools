import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetTableRecords, mockCreateTableRecords, mockUpdateTableRecords, mockExecuteProcedure } =
  vi.hoisted(() => ({
    mockGetTableRecords: vi.fn(),
    mockCreateTableRecords: vi.fn(),
    mockUpdateTableRecords: vi.fn(),
    mockExecuteProcedure: vi.fn(),
  }));

vi.mock('@/lib/providers/ministry-platform', () => ({
  MPHelper: class {
    getTableRecords = mockGetTableRecords;
    createTableRecords = mockCreateTableRecords;
    updateTableRecords = mockUpdateTableRecords;
    executeProcedure = mockExecuteProcedure;
  },
}));

import {
  CopyFromEventService,
  looksLikeHtml,
  mergeText,
  pairKey,
  resolveOccurrences,
  toRoomCreate,
} from './copyFromEventService';
import { EVENT_ROOM_COPY_COLUMNS, EventRoomCreateSchema } from '@/lib/dto';
import type { EventFieldValues, EventRoomRow, SeriesOccurrence } from '@/lib/dto';

function eventValues(overrides: Partial<EventFieldValues> = {}): EventFieldValues {
  return {
    Event_ID: 1,
    Event_Title: 'Night of Worship',
    Event_Start_Date: '2026-09-17T19:00:00',
    Congregation_Name: 'Granger',
    Meeting_Instructions: null,
    Description: null,
    Additional_Description: null,
    Online_Registration_Product: null,
    Product_Name: null,
    Registration_Form: null,
    Form_Title: null,
    Registrant_Group: null,
    Group_Name: null,
    ...overrides,
  };
}

function roomRow(overrides: Partial<EventRoomRow> = {}): EventRoomRow {
  return {
    Event_Room_ID: 100,
    Event_ID: 2,
    Room_ID: 19,
    Room_Name: '3 Years',
    Building_Name: 'Granger Building',
    Group_ID: 7004,
    Group_Name: '3 yrs',
    Room_Layout_ID: null,
    Layout_Name: null,
    Default_Group_Room: null,
    Balance_Priority: 0,
    Closed: false,
    Auto_Close_At_Capacity: false,
    Front_of_Room: null,
    Chairs: null,
    Auditorium_Chairs: null,
    Round_Tables: null,
    Tables: null,
    Presenter_Tables: null,
    Presenter_Chairs: null,
    Power_Strips: null,
    Room_Occupied: true,
    Notes: null,
    Checkin_Capacity: null,
    Cancelled: false,
    ...overrides,
  };
}

const occ = (id: number, date: string): SeriesOccurrence => ({
  Event_ID: id,
  Event_Title: 'Series',
  Event_Start_Date: date,
});

describe('copyFromEventService pure helpers', () => {
  describe('looksLikeHtml', () => {
    it('detects tags', () => {
      expect(looksLikeHtml('<b>WHAT:</b><br>')).toBe(true);
      expect(looksLikeHtml('plain text')).toBe(false);
      expect(looksLikeHtml(null)).toBe(false);
      expect(looksLikeHtml('a < b and c > d')).toBe(false);
    });
  });

  describe('mergeText', () => {
    it('overwrite returns the source, including null', () => {
      expect(mergeText('old', 'new', 'overwrite')).toBe('new');
      expect(mergeText('old', null, 'overwrite')).toBeNull();
    });

    it('append joins plain text with two newlines', () => {
      expect(mergeText('old', 'new', 'append')).toBe('old\n\nnew');
    });

    it('append joins with <br><br> when either side has HTML', () => {
      expect(mergeText('<b>old</b>', 'new', 'append')).toBe('<b>old</b><br><br>new');
      expect(mergeText('old', 'new<br>', 'append')).toBe('old<br><br>new<br>');
    });

    it('append onto an empty target is a plain overwrite', () => {
      expect(mergeText(null, 'new', 'append')).toBe('new');
      expect(mergeText('   ', 'new', 'append')).toBe('new');
    });

    it('append of an empty source leaves the target unchanged', () => {
      expect(mergeText('old', null, 'append')).toBe('old');
      expect(mergeText('old', '', 'append')).toBe('old');
    });
  });

  describe('pairKey', () => {
    it('uses "null" for a missing group', () => {
      expect(pairKey(5, 19, null)).toBe('5:19:null');
      expect(pairKey(5, 19, 7004)).toBe('5:19:7004');
    });
  });

  describe('toRoomCreate', () => {
    it('copies exactly the copy columns plus Event_ID and Cancelled=false', () => {
      const created = toRoomCreate(roomRow({ Chairs: 12, Front_of_Room: 'North', Notes: 'Test' }), 99);
      expect(created.Event_ID).toBe(99);
      expect(created.Cancelled).toBe(false);
      expect(created.Chairs).toBe(12);
      expect(created.Front_of_Room).toBe('North');
      expect(created.Room_Occupied).toBe(true);
      expect(Object.keys(created).sort()).toEqual(
        ['Event_ID', 'Cancelled', ...EVENT_ROOM_COPY_COLUMNS].sort(),
      );
      expect(created).not.toHaveProperty('Event_Room_ID');
      expect(created).not.toHaveProperty('_Approved');
      expect(created).not.toHaveProperty('Room_Name');
      expect(() => EventRoomCreateSchema.parse(created)).not.toThrow();
    });
  });

  describe('resolveOccurrences', () => {
    const target = occ(2, '2026-09-17T09:30:00');
    const series = [
      occ(3, '2026-09-24T09:30:00'),
      occ(1, '2026-09-10T09:30:00'),
      target,
      occ(4, '2026-10-01T09:30:00'),
    ];

    it('"this" returns only the target', () => {
      expect(resolveOccurrences(target, series, 'this')).toEqual([target]);
    });

    it('"future" keeps the target and later occurrences, sorted', () => {
      expect(resolveOccurrences(target, series, 'future').map((o) => o.Event_ID)).toEqual([2, 3, 4]);
    });

    it('"all" returns every occurrence sorted', () => {
      expect(resolveOccurrences(target, series, 'all').map((o) => o.Event_ID)).toEqual([1, 2, 3, 4]);
    });

    it('standalone event with "all" still returns the target', () => {
      expect(resolveOccurrences(target, [], 'all')).toEqual([target]);
      expect(resolveOccurrences(target, [], 'future')).toEqual([target]);
    });

    it('dedupes by Event_ID', () => {
      expect(resolveOccurrences(target, [target, target], 'all')).toEqual([target]);
    });
  });
});

describe('CopyFromEventService', () => {
  let service: CopyFromEventService;

  beforeEach(async () => {
    vi.clearAllMocks();
    (CopyFromEventService as unknown as { instance: unknown }).instance = undefined;
    service = await CopyFromEventService.getInstance();
  });

  it('is a singleton', async () => {
    expect(await CopyFromEventService.getInstance()).toBe(service);
  });

  describe('getEventFieldValues', () => {
    it('queries with qualified columns and FK display names', async () => {
      mockGetTableRecords.mockResolvedValueOnce([eventValues()]);
      const result = await service.getEventFieldValues(97983);
      expect(result?.Event_ID).toBe(1);
      const params = mockGetTableRecords.mock.calls[0][0];
      expect(params.table).toBe('Events');
      expect(params.filter).toBe('Events.Event_ID = 97983');
      expect(params.select).toContain('Events.Additional_Description');
      expect(params.select).toContain('Online_Registration_Product_TABLE.Product_Name');
      expect(params.select).toContain('Registrant_Group_TABLE.Group_Name');
      expect(params.top).toBe(1);
    });

    it('returns null when not found and rejects bad ids', async () => {
      mockGetTableRecords.mockResolvedValueOnce([]);
      expect(await service.getEventFieldValues(5)).toBeNull();
      await expect(service.getEventFieldValues(-1)).rejects.toThrow();
    });
  });

  describe('getSeriesOccurrences', () => {
    it('calls the core proc and maps/sorts the first result set', async () => {
      mockExecuteProcedure.mockResolvedValueOnce([
        [
          { Event_ID: 96784, Event_Title: 'BE', Event_Start_Date: '2026-09-17T09:30:00', Other: 'x' },
          { Event_ID: 96783, Event_Title: 'BE', Event_Start_Date: '2026-09-10T09:30:00' },
        ],
      ]);
      const result = await service.getSeriesOccurrences(96784);
      expect(mockExecuteProcedure).toHaveBeenCalledWith('api_Common_GetEventsInSeries', { '@EventID': 96784 });
      expect(result).toEqual([
        { Event_ID: 96783, Event_Title: 'BE', Event_Start_Date: '2026-09-10T09:30:00' },
        { Event_ID: 96784, Event_Title: 'BE', Event_Start_Date: '2026-09-17T09:30:00' },
      ]);
    });

    it('returns [] for a standalone event (empty or missing result set)', async () => {
      mockExecuteProcedure.mockResolvedValueOnce([[]]);
      expect(await service.getSeriesOccurrences(97983)).toEqual([]);
      mockExecuteProcedure.mockResolvedValueOnce([]);
      expect(await service.getSeriesOccurrences(97983)).toEqual([]);
    });
  });

  describe('searchEvents', () => {
    it('escapes LIKE terms and excludes the target, newest first', async () => {
      mockGetTableRecords.mockResolvedValueOnce([]);
      await service.searchEvents({ term: "O'Brien 100%_x", excludeEventId: 7 });
      const params = mockGetTableRecords.mock.calls[0][0];
      expect(params.filter).toBe(
        "Events.Event_ID <> 7 AND Events.Event_Title LIKE '%O''Brien 100[%][_]x%'",
      );
      expect(params.orderBy).toBe('Events.Event_Start_Date DESC');
      expect(params.top).toBe(25);
      expect(params.select).toContain('Congregation_ID_TABLE.Congregation_Name');
    });

    it('exact title uses = with plain quote doubling (no bracket escaping)', async () => {
      mockGetTableRecords.mockResolvedValueOnce([]);
      await service.searchEvents({ exactTitle: "Kids' Night_1", excludeEventId: 7 });
      expect(mockGetTableRecords.mock.calls[0][0].filter).toBe(
        "Events.Event_ID <> 7 AND Events.Event_Title = 'Kids'' Night_1'",
      );
    });

    it('returns [] without querying for a blank term', async () => {
      expect(await service.searchEvents({ term: '   ', excludeEventId: 7 })).toEqual([]);
      expect(await service.searchEvents({ excludeEventId: 7 })).toEqual([]);
      expect(mockGetTableRecords).not.toHaveBeenCalled();
    });
  });

  describe('getRoomCounts / attachRoomCounts', () => {
    it('groups by Event_ID and maps counts', async () => {
      mockGetTableRecords.mockResolvedValueOnce([{ Event_ID: 1, Room_Count: 36 }]);
      const counts = await service.getRoomCounts([1, 2]);
      const params = mockGetTableRecords.mock.calls[0][0];
      expect(params.table).toBe('Event_Rooms');
      expect(params.groupBy).toBe('Event_ID');
      expect(params.filter).toBe('Event_ID IN (1, 2) AND Cancelled = 0');
      expect(counts.get(1)).toBe(36);
      expect(counts.has(2)).toBe(false);
    });

    it('does not query for an empty list and swallows errors', async () => {
      expect((await service.getRoomCounts([])).size).toBe(0);
      expect(mockGetTableRecords).not.toHaveBeenCalled();
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockGetTableRecords.mockRejectedValueOnce(new Error('boom'));
      expect((await service.getRoomCounts([1])).size).toBe(0);
      warn.mockRestore();
    });

    it('attachRoomCounts defaults missing counts to 0', async () => {
      mockGetTableRecords.mockResolvedValueOnce([{ Event_ID: 1, Room_Count: 3 }]);
      const result = await service.attachRoomCounts([
        { Event_ID: 1, Event_Title: 'a', Event_Start_Date: 'd', Congregation_Name: null },
        { Event_ID: 2, Event_Title: 'b', Event_Start_Date: 'd', Congregation_Name: null },
      ]);
      expect(result.map((r) => r.Room_Count)).toEqual([3, 0]);
    });
  });

  describe('getEventRooms', () => {
    it('qualifies every base column and filters cancelled by default', async () => {
      mockGetTableRecords.mockResolvedValueOnce([]);
      await service.getEventRooms(95394, { includeCancelled: false });
      const params = mockGetTableRecords.mock.calls[0][0];
      expect(params.filter).toBe('Event_Rooms.Event_ID = 95394 AND Event_Rooms.Cancelled = 0');
      expect(params.select).toContain('Room_ID_TABLE_Building_ID_TABLE.Building_Name');
      expect(params.select).toContain('Room_Layout_ID_TABLE.Layout_Name');
      expect(params.select).toContain('Event_Rooms.Front_of_Room');
      expect(params.select).toContain('Event_Rooms.Room_Occupied');
      expect(params.select).not.toMatch(/(^|, )Notes/);
    });

    it('includes cancelled rows when asked', async () => {
      mockGetTableRecords.mockResolvedValueOnce([]);
      await service.getEventRooms(95394, { includeCancelled: true });
      expect(mockGetTableRecords.mock.calls[0][0].filter).toBe('Event_Rooms.Event_ID = 95394');
    });
  });

  describe('getExistingRoomPairs', () => {
    it('batches ids by 100 and keys with null groups', async () => {
      const ids = Array.from({ length: 150 }, (_, i) => i + 1);
      mockGetTableRecords
        .mockResolvedValueOnce([{ Event_ID: 1, Room_ID: 19, Group_ID: null }])
        .mockResolvedValueOnce([{ Event_ID: 120, Room_ID: 61, Group_ID: 7004 }]);
      const pairs = await service.getExistingRoomPairs(ids);
      expect(mockGetTableRecords).toHaveBeenCalledTimes(2);
      expect(mockGetTableRecords.mock.calls[0][0].filter).toMatch(/^Event_ID IN \(1, 2, .*100\) AND Cancelled = 0$/);
      expect(pairs.has('1:19:null')).toBe(true);
      expect(pairs.has('120:61:7004')).toBe(true);
    });
  });

  describe('writes', () => {
    it('updateEventFields passes $userId and no schema', async () => {
      await service.updateEventFields(5, { Description: 'x' }, 42);
      expect(mockUpdateTableRecords).toHaveBeenCalledWith(
        'Events',
        [{ Event_ID: 5, Description: 'x' }],
        { $userId: 42 },
      );
    });

    it('createEventRooms passes the hand-written schema and skips empty batches', async () => {
      await service.createEventRooms([], 42);
      expect(mockCreateTableRecords).not.toHaveBeenCalled();
      const rec = toRoomCreate(roomRow(), 5);
      await service.createEventRooms([rec], 42);
      expect(mockCreateTableRecords).toHaveBeenCalledWith('Event_Rooms', [rec], {
        schema: EventRoomCreateSchema,
        $userId: 42,
      });
    });
  });

  describe('applyCopy', () => {
    const target = eventValues({ Event_ID: 10, Event_Start_Date: '2026-09-17T19:00:00' });
    const source = eventValues({
      Event_ID: 20,
      Event_Start_Date: '2026-03-24T19:00:00',
      Description: '<b>WHAT:</b> worship',
      Online_Registration_Product: 55,
      Product_Name: 'NOW Product',
    });

    /** getTableRecords is dispatched by table/select so call order doesn't matter. */
    function mockReads(opts: {
      currentByEvent?: Record<number, EventFieldValues>;
      sourceRooms?: EventRoomRow[];
      existingPairs?: Array<{ Event_ID: number; Room_ID: number; Group_ID: number | null }>;
    }) {
      mockGetTableRecords.mockImplementation(async (params: { table: string; select: string; filter: string }) => {
        if (params.table === 'Events' && params.filter === 'Events.Event_ID = 10') return [target];
        if (params.table === 'Events' && params.filter === 'Events.Event_ID = 20') return [source];
        if (params.table === 'Events' && params.filter.startsWith('Events.Event_ID IN')) {
          return Object.values(opts.currentByEvent ?? { 10: target });
        }
        if (params.table === 'Event_Rooms' && params.select.includes('Event_Room_ID')) {
          return opts.sourceRooms ?? [];
        }
        if (params.table === 'Event_Rooms' && params.select === 'Event_ID, Room_ID, Group_ID') {
          return opts.existingPairs ?? [];
        }
        throw new Error(`unexpected query ${params.table} ${params.select} ${params.filter}`);
      });
    }

    it('rejects same source and target', async () => {
      await expect(
        service.applyCopy({ targetEventId: 1, sourceEventId: 1, scope: 'this', fields: {}, sourceEventRoomIds: [] }, 42),
      ).rejects.toThrow('different');
    });

    it('overwrites a text field and copies an FK on a single occurrence', async () => {
      mockReads({});
      const result = await service.applyCopy(
        {
          targetEventId: 10,
          sourceEventId: 20,
          scope: 'this',
          fields: { Description: { mode: 'overwrite' }, Online_Registration_Product: { mode: 'overwrite' } },
          sourceEventRoomIds: [],
        },
        42,
      );
      expect(mockExecuteProcedure).not.toHaveBeenCalled();
      expect(mockUpdateTableRecords).toHaveBeenCalledTimes(1);
      expect(mockUpdateTableRecords).toHaveBeenCalledWith(
        'Events',
        [{ Event_ID: 10, Description: '<b>WHAT:</b> worship', Online_Registration_Product: 55 }],
        { $userId: 42 },
      );
      expect(result.occurrences[0].fieldsUpdated).toEqual(['Description', 'Online_Registration_Product']);
      expect(result.summary).toEqual({ occurrenceCount: 1, fieldsUpdated: 2, roomsCreated: 0, roomsSkipped: 0, failed: 0 });
    });

    it('skips the update when nothing would change', async () => {
      mockReads({ currentByEvent: { 10: { ...target, Description: source.Description } } });
      const result = await service.applyCopy(
        { targetEventId: 10, sourceEventId: 20, scope: 'this', fields: { Description: { mode: 'overwrite' } }, sourceEventRoomIds: [] },
        42,
      );
      expect(mockUpdateTableRecords).not.toHaveBeenCalled();
      expect(result.occurrences[0].fieldsUpdated).toEqual([]);
    });

    it('appends text and reports a field error when the limit is exceeded, still creating rooms', async () => {
      const longSource = eventValues({ Event_ID: 20, Description: 'x'.repeat(1500) });
      mockGetTableRecords.mockImplementation(async (params: { table: string; select: string; filter: string }) => {
        if (params.filter === 'Events.Event_ID = 10') return [{ ...target, Description: 'y'.repeat(600) }];
        if (params.filter === 'Events.Event_ID = 20') return [longSource];
        if (params.filter.startsWith('Events.Event_ID IN')) return [{ ...target, Description: 'y'.repeat(600) }];
        if (params.table === 'Event_Rooms' && params.select.includes('Event_Room_ID')) return [roomRow({ Event_Room_ID: 100 })];
        return [];
      });
      const result = await service.applyCopy(
        { targetEventId: 10, sourceEventId: 20, scope: 'this', fields: { Description: { mode: 'append' } }, sourceEventRoomIds: [100] },
        42,
      );
      expect(mockUpdateTableRecords).not.toHaveBeenCalled();
      expect(result.occurrences[0].fieldError).toMatch(/limit is 2000/);
      expect(result.occurrences[0].roomsCreated).toBe(1);
      expect(result.summary.failed).toBe(1);
    });

    it('creates rooms, skips existing pairs, dedupes source pairs, ignores foreign ids', async () => {
      mockReads({
        sourceRooms: [
          roomRow({ Event_Room_ID: 100, Room_ID: 19, Group_ID: 7004 }),
          roomRow({ Event_Room_ID: 101, Room_ID: 19, Group_ID: 7004 }), // duplicate pair on source
          roomRow({ Event_Room_ID: 102, Room_ID: 61, Group_ID: null }),
          roomRow({ Event_Room_ID: 103, Room_ID: 10, Group_ID: 6996 }),
        ],
        existingPairs: [{ Event_ID: 10, Room_ID: 61, Group_ID: null }],
      });
      const result = await service.applyCopy(
        { targetEventId: 10, sourceEventId: 20, scope: 'this', fields: {}, sourceEventRoomIds: [100, 101, 102, 999] },
        42,
      );
      expect(mockCreateTableRecords).toHaveBeenCalledTimes(1);
      const [table, records, opts] = mockCreateTableRecords.mock.calls[0];
      expect(table).toBe('Event_Rooms');
      expect(opts).toEqual({ schema: EventRoomCreateSchema, $userId: 42 });
      expect(records).toHaveLength(1);
      expect(records[0]).toMatchObject({ Event_ID: 10, Room_ID: 19, Group_ID: 7004, Cancelled: false });
      expect(records[0]).not.toHaveProperty('Event_Room_ID');
      expect(result.occurrences[0]).toMatchObject({ roomsCreated: 1, roomsSkipped: 1 });
      expect(mockUpdateTableRecords).not.toHaveBeenCalled();
    });

    it('fans out across the series and isolates a failure to one occurrence', async () => {
      const occurrences = [
        { Event_ID: 9, Event_Title: 'S', Event_Start_Date: '2026-09-10T19:00:00' },
        { Event_ID: 10, Event_Title: 'S', Event_Start_Date: '2026-09-17T19:00:00' },
        { Event_ID: 11, Event_Title: 'S', Event_Start_Date: '2026-09-24T19:00:00' },
        { Event_ID: 12, Event_Title: 'S', Event_Start_Date: '2026-10-01T19:00:00' },
      ];
      mockExecuteProcedure.mockResolvedValueOnce([occurrences]);
      mockReads({
        currentByEvent: {
          10: target,
          11: eventValues({ Event_ID: 11 }),
          12: eventValues({ Event_ID: 12 }),
        },
      });
      mockUpdateTableRecords
        .mockResolvedValueOnce([])
        .mockRejectedValueOnce(new Error('MP said no'))
        .mockResolvedValueOnce([]);

      const result = await service.applyCopy(
        { targetEventId: 10, sourceEventId: 20, scope: 'future', fields: { Description: { mode: 'overwrite' } }, sourceEventRoomIds: [] },
        42,
      );

      expect(mockExecuteProcedure).toHaveBeenCalledWith('api_Common_GetEventsInSeries', { '@EventID': 10 });
      expect(result.occurrences.map((o) => o.Event_ID)).toEqual([10, 11, 12]);
      expect(result.occurrences[0].fieldsUpdated).toEqual(['Description']);
      expect(result.occurrences[1].fieldError).toBe('MP said no');
      expect(result.occurrences[1].fieldsUpdated).toEqual([]);
      expect(result.occurrences[2].fieldsUpdated).toEqual(['Description']);
      expect(result.summary).toMatchObject({ occurrenceCount: 3, fieldsUpdated: 2, failed: 1 });
      // Batched current-values lookup used the resolved ids
      const inCall = mockGetTableRecords.mock.calls.find((c) => String(c[0].filter).startsWith('Events.Event_ID IN'));
      expect(inCall?.[0].filter).toBe('Events.Event_ID IN (10, 11, 12)');
    });
  });
});
