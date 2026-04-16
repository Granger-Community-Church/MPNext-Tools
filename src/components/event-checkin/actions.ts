'use server';

import React from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { pdf } from '@react-pdf/renderer';
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

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session;
}

export async function fetchEventData(eventId: number): Promise<{
  event: EventSummary | null;
  participants: EventParticipantRow[];
  statuses: ParticipationStatus[];
}> {
  await getSession();

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
  await getSession();

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
  await getSession();

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
