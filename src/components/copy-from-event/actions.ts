'use server';

import { AuthorizationService } from '@/services/authorizationService';
import { CopyFromEventService } from '@/services/copyFromEventService';
import type {
  ApplyCopyPayload,
  ApplyCopyResponse,
  EventFieldValues,
  EventRoomRow,
  SeriesOccurrence,
  SourceEventSearchResult,
} from '@/lib/dto';

/**
 * Authorization gate for this feature's server actions.
 *
 * A server action is a callable POST endpoint whether or not the page that
 * renders it was ever fetched, so the tools layout gate is not sufficient on
 * its own. "A session exists" proves nothing here: MP's OIDC endpoint
 * authenticates ANY dp_Users record, and this app reads MP with its own service
 * account. The service gates again and owns `$userId` attribution.
 */
async function requireAccess(
  table: string,
  operation: 'read' | 'create' | 'update' | 'delete',
): Promise<number> {
  return AuthorizationService.getInstance().requireSecurityRole({ table, operation });
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
  await requireAccess('Events', 'read');
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
  await requireAccess('Events', 'read');
  const service = await CopyFromEventService.getInstance();
  const matches = await service.searchEvents({ term, excludeEventId });
  return service.attachRoomCounts(matches);
}

export async function fetchSourceEventDetails(sourceEventId: number): Promise<{
  source: EventFieldValues | null;
  /** Includes cancelled rows; the client decides whether to show them. */
  rooms: EventRoomRow[];
}> {
  await requireAccess('Events', 'read');
  const service = await CopyFromEventService.getInstance();
  const [source, rooms] = await Promise.all([
    service.getEventFieldValues(sourceEventId),
    service.getEventRooms(sourceEventId, { includeCancelled: true }),
  ]);
  return { source, rooms };
}

export async function applyCopyFromEvent(payload: ApplyCopyPayload): Promise<ApplyCopyResponse> {
  await requireAccess('Events', 'update');
  try {
    const service = await CopyFromEventService.getInstance();
    return await service.applyCopy(payload);
  } catch (error) {
    console.error('applyCopyFromEvent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to copy from event',
    };
  }
}
