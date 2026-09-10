import { describe, it, expect } from 'vitest';
import {
  formatGroupLabel,
  formatMpDateTime,
  looksLikeHtml,
  mergeText,
  pairKey,
  resolveOccurrences,
  roomGroupKey,
  toRoomCreate,
} from './copy-from-event-utils';
import { EVENT_ROOM_COPY_COLUMNS, EventRoomCreateSchema } from '@/lib/dto';
import type { EventRoomRow, SeriesOccurrence } from '@/lib/dto';

function roomRow(overrides: Partial<EventRoomRow> = {}): EventRoomRow {
  return {
    Event_Room_ID: 100,
    Event_ID: 2,
    Room_ID: 19,
    Room_Name: '3 Years',
    Building_Name: 'Granger Building',
    Group_ID: 7004,
    Group_Name: '3 yrs',
    Group_Congregation_Name: 'Granger Campus',
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

describe('copy-from-event-utils', () => {
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

  describe('formatGroupLabel', () => {
    it('appends the congregation in parentheses', () => {
      expect(formatGroupLabel({ Group_Name: '5th Grade Volunteers', Group_Congregation_Name: 'Elkhart Campus' })).toBe(
        '5th Grade Volunteers (Elkhart Campus)',
      );
    });

    it('falls back to the bare name, and null when there is no group', () => {
      expect(formatGroupLabel({ Group_Name: 'Cafe', Group_Congregation_Name: null })).toBe('Cafe');
      expect(formatGroupLabel({ Group_Name: null, Group_Congregation_Name: 'Granger Campus' })).toBeNull();
    });
  });

  describe('roomGroupKey', () => {
    it('omits the event', () => {
      expect(roomGroupKey(19, null)).toBe('19:null');
      expect(roomGroupKey(19, 7)).toBe('19:7');
    });
  });

  describe('formatMpDateTime', () => {
    it('formats the stored wall-clock regardless of browser zone', () => {
      expect(formatMpDateTime('2026-09-17T19:00:00')).toBe('Sep 17, 2026, 7:00 PM');
      expect(formatMpDateTime('2026-09-17T19:00:00', { withTime: false })).toBe('Sep 17, 2026');
      expect(formatMpDateTime('2026-09-17T09:30:00', { weekday: true })).toBe('Thu, Sep 17, 2026, 9:30 AM');
    });

    it('handles empty and unparseable input', () => {
      expect(formatMpDateTime(null)).toBe('\u2014');
      expect(formatMpDateTime('not a date')).toBe('not a date');
    });
  });
});
