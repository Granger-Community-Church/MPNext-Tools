import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockRequireSecurityRole,
  mockGetInstance,
  mockGetEventFieldValues,
  mockGetSeriesOccurrences,
  mockGetEventRooms,
  mockSearchEvents,
  mockAttachRoomCounts,
  mockApplyCopy,
} = vi.hoisted(() => ({
  mockRequireSecurityRole: vi.fn(),
  mockGetInstance: vi.fn(),
  mockGetEventFieldValues: vi.fn(),
  mockGetSeriesOccurrences: vi.fn(),
  mockGetEventRooms: vi.fn(),
  mockSearchEvents: vi.fn(),
  mockAttachRoomCounts: vi.fn(),
  mockApplyCopy: vi.fn(),
}));

/**
 * The actions gate through AuthorizationService; the gate itself has its own
 * tests in `authorizationService.test.ts`, so it is stubbed here.
 */
vi.mock('@/services/authorizationService', () => ({
  AuthorizationService: {
    getInstance: () => ({ requireSecurityRole: mockRequireSecurityRole }),
  },
  UnauthorizedError: class UnauthorizedError extends Error {
    constructor(message = 'Not authorized') {
      super(message);
    }
  },
}));

vi.mock('@/services/copyFromEventService', () => ({
  CopyFromEventService: { getInstance: mockGetInstance },
}));

import {
  fetchCopyFromEventData,
  searchSourceEvents,
  fetchSourceEventDetails,
  applyCopyFromEvent,
} from './actions';
import { UnauthorizedError } from '@/services/authorizationService';

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
    mockRequireSecurityRole.mockResolvedValue(42);
    mockGetInstance.mockResolvedValue({
      getEventFieldValues: mockGetEventFieldValues,
      getSeriesOccurrences: mockGetSeriesOccurrences,
      getEventRooms: mockGetEventRooms,
      searchEvents: mockSearchEvents,
      attachRoomCounts: mockAttachRoomCounts,
      applyCopy: mockApplyCopy,
    });
    mockAttachRoomCounts.mockImplementation(async (events: unknown[]) => events);
  });

  describe('authorization gate', () => {
    it('every action refuses a caller without a security role', async () => {
      mockRequireSecurityRole.mockRejectedValue(new UnauthorizedError());
      await expect(fetchCopyFromEventData(10)).rejects.toThrow('Not authorized');
      await expect(searchSourceEvents('x', 10)).rejects.toThrow('Not authorized');
      await expect(fetchSourceEventDetails(20)).rejects.toThrow('Not authorized');
      await expect(applyCopyFromEvent({ targetEventId: 10, sourceEventId: 20, scope: 'this', fields: {}, sourceEventRoomIds: [] })).rejects.toThrow('Not authorized');
      expect(mockGetInstance).not.toHaveBeenCalled();
    });

    it('gates reads as Events/read', async () => {
      mockSearchEvents.mockResolvedValue([]);
      await searchSourceEvents('x', 10);
      expect(mockRequireSecurityRole).toHaveBeenCalledWith({ table: 'Events', operation: 'read' });
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

    it('gates the write and leaves $userId attribution to the service', async () => {
      const ok = { success: true as const, occurrences: [], summary: { occurrenceCount: 0, fieldsUpdated: 0, roomsCreated: 0, roomsSkipped: 0, failed: 0 } };
      mockApplyCopy.mockResolvedValue(ok);
      const result = await applyCopyFromEvent(payload);
      expect(mockRequireSecurityRole).toHaveBeenCalledWith({ table: 'Events', operation: 'update' });
      expect(mockApplyCopy).toHaveBeenCalledWith(payload);
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
