'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolContainer } from '@/components/tool';
import { ParticipantList } from '@/components/event-checkin/participant-list';
import { NametagConfigForm } from '@/components/event-checkin/nametag-config-form';
import { StatusUpdateDialog } from '@/components/event-checkin/status-update-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Printer, UserCheck } from 'lucide-react';
import {
  fetchEventData,
  generateNametagPdf,
  updateParticipantStatuses,
} from '@/components/event-checkin/actions';
import type { ToolParams } from '@/lib/tool-params';
import type {
  EventSummary,
  EventParticipantRow,
  ParticipationStatus,
  NametagConfig,
  NametagData,
} from '@/lib/dto';

interface EventCheckinProps {
  params: ToolParams;
}

export function EventCheckin({ params }: EventCheckinProps) {
  const router = useRouter();
  const eventId = params.recordID;

  const [event, setEvent] = useState<EventSummary | null>(null);
  const [participants, setParticipants] = useState<EventParticipantRow[]>([]);
  const [statuses, setStatuses] = useState<ParticipationStatus[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const [nametagConfig, setNametagConfig] = useState<NametagConfig>({
    layout: 'first-last-initial',
    startPosition: 1,
  });

  const loadData = useCallback(async () => {
    if (!eventId || eventId === -1) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchEventData(eventId);
      setEvent(data.event);
      setParticipants(data.participants);
      setStatuses(data.statuses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load event data');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatEventDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrintNametags = async () => {
    if (selectedIds.size === 0 || !event) return;

    setIsGenerating(true);
    setError(null);

    try {
      const selected = participants.filter((p) =>
        selectedIds.has(p.Event_Participant_ID),
      );

      const nametags: NametagData[] = selected.map((p) => ({
        firstName: p.Nickname || p.First_Name,
        lastName: p.Last_Name,
        eventTitle: event.Event_Title,
        eventDate: formatEventDate(event.Event_Start_Date),
        layout: nametagConfig.layout,
      }));

      const result = await generateNametagPdf(nametags, nametagConfig);

      if (!result.success) {
        setError(result.error);
        return;
      }

      const byteCharacters = atob(result.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nametags.pdf';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStatusUpdate = async (statusId: number, timeIn: string | null) => {
    const result = await updateParticipantStatuses({
      eventParticipantIds: Array.from(selectedIds),
      participationStatusId: statusId,
      timeIn,
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSelectedIds(new Set());
    await loadData();
  };

  const handleClose = () => {
    router.back();
  };

  if (!eventId || eventId === -1) {
    return (
      <ToolContainer title="Event Check-in" onClose={handleClose} hideFooter>
        <div className="px-6 py-4 text-sm text-muted-foreground">
          This tool must be launched from an Event record.
        </div>
      </ToolContainer>
    );
  }

  return (
    <ToolContainer
      title="Event Check-in"
      onClose={handleClose}
      hideFooter
    >
      <div className="px-6 py-4 space-y-4 max-w-3xl">
        {event && (
          <div className="text-sm text-muted-foreground">
            {event.Event_Title} &mdash; {formatEventDate(event.Event_Start_Date)}
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading event data...
          </div>
        ) : (
          <>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 rounded-md p-3">
                {error}
              </div>
            )}

            <NametagConfigForm config={nametagConfig} onChange={setNametagConfig} />

            <ParticipantList
              participants={participants}
              statuses={statuses}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />

            <div className="flex gap-3">
              <Button
                onClick={handlePrintNametags}
                disabled={selectedIds.size === 0 || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Printer className="h-4 w-4 mr-2" />
                )}
                Print Nametags ({selectedIds.size})
              </Button>
              <Button
                variant="secondary"
                onClick={() => setStatusDialogOpen(true)}
                disabled={selectedIds.size === 0}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Update Status ({selectedIds.size})
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>

            <StatusUpdateDialog
              open={statusDialogOpen}
              onOpenChange={setStatusDialogOpen}
              statuses={statuses}
              selectedCount={selectedIds.size}
              onConfirm={handleStatusUpdate}
            />
          </>
        )}
      </div>
    </ToolContainer>
  );
}
