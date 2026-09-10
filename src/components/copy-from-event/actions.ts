'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { CopyFromEventService } from '@/services/copyFromEventService';
import { getCurrentUserIdFromSession } from '@/components/shared-actions/user';
import type {
  ApplyCopyPayload,
  ApplyCopyResponse,
  EventFieldValues,
  EventRoomRow,
  SeriesOccurrence,
  SourceEventSearchResult,
} from '@/lib/dto';

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session;
}

export interface CopyFromEventData {
  target: EventFieldValues | null;
  /** All occurrences of the target's series; empty for a standalone event. */
  series: SeriesOccurrence[];
  /** Non-cancelled rooms already on the target (for duplicate hints). */
  targetRooms: EventRoomRow[];
  /** Other events with exactly the target's title, newest first. */
  sameTitleEvents: SourceEventSearchResult[];
}

export async function fetchCopyFromEventData(targetEventId: number): Promise<CopyFromEventData> {
  await getSession();
  const service = await CopyFromEventService.getInstance();

  const [target, series, targetRooms] = await Promise.all([
    service.getEventFieldValues(targetEventId),
    service.getSeriesOccurrences(targetEventId),
    service.getEventRooms(targetEventId, { includeCancelled: false }),
  ]);

  let sameTitleEvents: SourceEventSearchResult[] = [];
  if (target) {
    const matches = await service.searchEvents({
      exactTitle: target.Event_Title,
      excludeEventId: targetEventId,
    });
    sameTitleEvents = await service.attachRoomCounts(matches);
  }

  return { target, series, targetRooms, sameTitleEvents };
}

export async function searchSourceEvents(
  term: string,
  excludeEventId: number,
): Promise<SourceEventSearchResult[]> {
  await getSession();
  const service = await CopyFromEventService.getInstance();
  const matches = await service.searchEvents({ term, excludeEventId });
  return service.attachRoomCounts(matches);
}

export async function fetchSourceEventDetails(sourceEventId: number): Promise<{
  source: EventFieldValues | null;
  /** Includes cancelled rows; the client decides whether to show them. */
  rooms: EventRoomRow[];
}> {
  await getSession();
  const service = await CopyFromEventService.getInstance();
  const [source, rooms] = await Promise.all([
    service.getEventFieldValues(sourceEventId),
    service.getEventRooms(sourceEventId, { includeCancelled: true }),
  ]);
  return { source, rooms };
}

export async function applyCopyFromEvent(payload: ApplyCopyPayload): Promise<ApplyCopyResponse> {
  const session = await getSession();
  try {
    const userId = await getCurrentUserIdFromSession(session);
    const service = await CopyFromEventService.getInstance();
    return await service.applyCopy(payload, userId);
  } catch (error) {
    console.error('applyCopyFromEvent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to copy from event',
    };
  }
}
