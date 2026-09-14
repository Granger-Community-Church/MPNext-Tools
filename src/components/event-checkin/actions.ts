'use server';

import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { AuthorizationService } from '@/services/authorizationService';
import { EventCheckinService } from '@/services/eventCheckinService';
import { registerPoppinsFont } from '@/lib/poppins-font';
import { AVERY_5395 } from '@/lib/nametag-stock';
import { NametagDocument } from './nametag-document';
import type {
  EventSummary,
  EventParticipantRow,
  ParticipationStatus,
  NametagData,
  NametagConfig,
  StatusUpdatePayload,
} from '@/lib/dto';

registerPoppinsFont();

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

export async function fetchEventData(eventId: number): Promise<{
  event: EventSummary | null;
  participants: EventParticipantRow[];
  statuses: ParticipationStatus[];
}> {
  await requireAccess('Event_Participants', 'read');

  const service = await EventCheckinService.getInstance();
  const [event, participants, statuses] = await Promise.all([
    service.getEventSummary(eventId),
    service.getEventParticipants(eventId),
    service.getParticipationStatuses(),
  ]);

  return { event, participants, statuses };
}

export async function generateNametagPdf(
  nametags: NametagData[],
  config: NametagConfig,
): Promise<{ success: true; data: string } | { success: false; error: string }> {
  // No MP call, but the nametags are participant names: same gate as the roster.
  await requireAccess('Event_Participants', 'read');

  if (nametags.length === 0) {
    return { success: false, error: 'No nametags to print' };
  }

  try {
    const doc = React.createElement(NametagDocument, {
      nametags,
      stock: AVERY_5395,
      startPosition: config.startPosition,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = pdf(doc as any);
    const blob = await instance.toBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return { success: true, data: base64 };
  } catch (error) {
    console.error('generateNametagPdf error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDF generation failed',
    };
  }
}

export async function updateParticipantStatuses(
  payload: StatusUpdatePayload,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAccess('Event_Participants', 'update');

  try {
    const service = await EventCheckinService.getInstance();

    await service.updateParticipationStatus(
      payload.eventParticipantIds,
      payload.participationStatusId,
      payload.timeIn,
    );

    return { success: true };
  } catch (error) {
    console.error('updateParticipantStatuses error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Status update failed',
    };
  }
}
