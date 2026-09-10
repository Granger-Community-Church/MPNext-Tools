import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockGetSession,
  mockGetInstance,
  mockGetEventFieldValues,
  mockGetSeriesOccurrences,
  mockGetEventRooms,
  mockSearchEvents,
  mockAttachRoomCounts,
  mockApplyCopy,
  mockUserGetInstance,
  mockGetUserIdByGuid,
} = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockGetInstance: vi.fn(),
  mockGetEventFieldValues: vi.fn(),
  mockGetSeriesOccurrences: vi.fn(),
  mockGetEventRooms: vi.fn(),
  mockSearchEvents: vi.fn(),
  mockAttachRoomCounts: vi.fn(),
  mockApplyCopy: vi.fn(),
  mockUserGetInstance: vi.fn(),
  mockGetUserIdByGuid: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: mockGetSession } },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/services/copyFromEventService', () => ({
  CopyFromEventService: { getInstance: mockGetInstance },
}));

vi.mock('@/services/userService', () => ({
  UserService: { getInstance: mockUserGetInstance },
}));

import {
  fetchCopyFromEventData,
  searchSourceEvents,
  fetchSourceEventDetails,
  applyCopyFromEvent,
} from './actions';

const authedSession = {
  user: { id: 'internal-id', userGuid: '550e8400-e29b-41d4-a716-446655440000' },
};

const target = {
  Event_ID: 10,
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
};

describe('copy-from-event actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue(authedSession);
    mockGetInstance.mockResolvedValue({
      getEventFieldValues: mockGetEventFieldValues,
      getSeriesOccurrences: mockGetSeriesOccurrences,
      getEventRooms: mockGetEventRooms,
      searchEvents: mockSearchEvents,
      attachRoomCounts: mockAttachRoomCounts,
      applyCopy: mockApplyCopy,
    });
    mockUserGetInstance.mockResolvedValue({ getUserIdByGuid: mockGetUserIdByGuid });
    mockGetUserIdByGuid.mockResolvedValue(42);
    mockAttachRoomCounts.mockImplementation(async (events: unknown[]) => events);
  });

  describe('auth guard', () => {
    it('every action throws Unauthorized without a session', async () => {
      mockGetSession.mockResolvedValue(null);
      await expect(fetchCopyFromEventData(10)).rejects.toThrow('Unauthorized');
      await expect(searchSourceEvents('x', 10)).rejects.toThrow('Unauthorized');
      await expect(fetchSourceEventDetails(20)).rejects.toThrow('Unauthorized');
      await expect(applyCopyFromEvent({ targetEventId: 10, sourceEventId: 20, scope: 'this', fields: {}, sourceEventRoomIds: [] })).rejects.toThrow('Unauthorized');
      expect(mockGetInstance).not.toHaveBeenCalled();
    });
  });

  describe('fetchCopyFromEventData', () => {
    it('loads target, series, rooms, and same-title prefill with room counts', async () => {
      mockGetEventFieldValues.mockResolvedValue(target);
      mockGetSeriesOccurrences.mockResolvedValue([]);
      mockGetEventRooms.mockResolvedValue([{ Event_Room_ID: 1 }]);
      mockSearchEvents.mockResolvedValue([{ Event_ID: 20, Event_Title: 'Night of Worship' }]);
      mockAttachRoomCounts.mockResolvedValue([{ Event_ID: 20, Event_Title: 'Night of Worship', Room_Count: 36 }]);

      const data = await fetchCopyFromEventData(10);

      expect(mockGetEventRooms).toHaveBeenCalledWith(10, { includeCancelled: false });
      expect(mockSearchEvents).toHaveBeenCalledWith({ exactTitle: 'Night of Worship', excludeEventId: 10 });
      expect(data.target).toBe(target);
      expect(data.series).toEqual([]);
      expect(data.targetRooms).toHaveLength(1);
      expect(data.sameTitleEvents[0].Room_Count).toBe(36);
    });

    it('skips the same-title search when the target is missing', async () => {
      mockGetEventFieldValues.mockResolvedValue(null);
      mockGetSeriesOccurrences.mockResolvedValue([]);
      mockGetEventRooms.mockResolvedValue([]);
      const data = await fetchCopyFromEventData(10);
      expect(data.target).toBeNull();
      expect(data.sameTitleEvents).toEqual([]);
      expect(mockSearchEvents).not.toHaveBeenCalled();
    });
  });

  describe('searchSourceEvents', () => {
    it('delegates with the term and exclusion, attaching counts', async () => {
      mockSearchEvents.mockResolvedValue([{ Event_ID: 3 }]);
      const result = await searchSourceEvents('worship', 10);
      expect(mockSearchEvents).toHaveBeenCalledWith({ term: 'worship', excludeEventId: 10 });
      expect(mockAttachRoomCounts).toHaveBeenCalledWith([{ Event_ID: 3 }]);
      expect(result).toEqual([{ Event_ID: 3 }]);
    });
  });

  describe('fetchSourceEventDetails', () => {
    it('returns the source and all rooms including cancelled', async () => {
      mockGetEventFieldValues.mockResolvedValue({ ...target, Event_ID: 20 });
      mockGetEventRooms.mockResolvedValue([{ Event_Room_ID: 5, Cancelled: true }]);
      const data = await fetchSourceEventDetails(20);
      expect(mockGetEventRooms).toHaveBeenCalledWith(20, { includeCancelled: true });
      expect(data.source?.Event_ID).toBe(20);
      expect(data.rooms).toHaveLength(1);
    });
  });

  describe('applyCopyFromEvent', () => {
    const payload = {
      targetEventId: 10,
      sourceEventId: 20,
      scope: 'this' as const,
      fields: { Description: { mode: 'overwrite' as const } },
      sourceEventRoomIds: [1, 2],
    };

    it('resolves the MP user id from the session and passes it to the service', async () => {
      const ok = { success: true as const, occurrences: [], summary: { occurrenceCount: 0, fieldsUpdated: 0, roomsCreated: 0, roomsSkipped: 0, failed: 0 } };
      mockApplyCopy.mockResolvedValue(ok);
      const result = await applyCopyFromEvent(payload);
      expect(mockGetUserIdByGuid).toHaveBeenCalledWith(authedSession.user.userGuid);
      expect(mockApplyCopy).toHaveBeenCalledWith(payload, 42);
      expect(result).toBe(ok);
    });

    it('wraps service errors in a failure result', async () => {
      const err = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockApplyCopy.mockRejectedValue(new Error('Source event 20 not found'));
      const result = await applyCopyFromEvent(payload);
      expect(result).toEqual({ success: false, error: 'Source event 20 not found' });
      err.mockRestore();
    });
  });
});
