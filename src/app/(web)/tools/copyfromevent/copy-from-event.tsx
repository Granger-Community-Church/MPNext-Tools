'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ToolContainer } from '@/components/tool';
import {
  SourceEventSearch,
  FieldCopySection,
  RoomCopySection,
  SeriesScopeSection,
} from '@/components/copy-from-event';
import { fetchCopyFromEventData, fetchSourceEventDetails } from '@/components/copy-from-event/actions';
import { Loader2, CalendarDays, Search } from 'lucide-react';
import { formatMpDateTime, roomGroupKey } from '@/lib/copy-from-event-utils';
import { emptyFieldSelections } from '@/lib/dto';
import type { ToolParams } from '@/lib/tool-params';
import type {
  EventFieldValues,
  EventRoomRow,
  FieldSelectionMap,
  SeriesOccurrence,
  SeriesScope,
  SourceEventSearchResult,
} from '@/lib/dto';

interface CopyFromEventProps {
  params: ToolParams;
}

const TOOL_TITLE = 'Copy From Event';

export function CopyFromEvent({ params }: CopyFromEventProps) {
  const router = useRouter();
  const targetEventId = params.recordID;

  const [target, setTarget] = useState<EventFieldValues | null>(null);
  const [series, setSeries] = useState<SeriesOccurrence[]>([]);
  const [targetRooms, setTargetRooms] = useState<EventRoomRow[]>([]);
  const [sameTitleEvents, setSameTitleEvents] = useState<SourceEventSearchResult[]>([]);

  const [selectedSource, setSelectedSource] = useState<SourceEventSearchResult | null>(null);
  const [source, setSource] = useState<EventFieldValues | null>(null);
  const [sourceRooms, setSourceRooms] = useState<EventRoomRow[]>([]);

  const [fieldSelections, setFieldSelections] = useState<FieldSelectionMap>(emptyFieldSelections());
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<number>>(new Set());
  const [showCancelledRooms, setShowCancelledRooms] = useState(false);
  const [scope, setScope] = useState<SeriesScope>('this');

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSource, setIsLoadingSource] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetPairs = useMemo(
    () => new Set(targetRooms.map((r) => roomGroupKey(r.Room_ID, r.Group_ID))),
    [targetRooms],
  );

  const loadTarget = useCallback(async () => {
    if (!targetEventId || targetEventId === -1) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCopyFromEventData(targetEventId);
      if (!data.target) {
        setError(`Event ${targetEventId} was not found.`);
        return;
      }
      setTarget(data.target);
      setSeries(data.series);
      setTargetRooms(data.targetRooms);
      setSameTitleEvents(data.sameTitleEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load the event');
    } finally {
      setIsLoading(false);
    }
  }, [targetEventId]);

  useEffect(() => {
    // Initial data load on mount / target change; loader sets loading + data state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTarget();
  }, [loadTarget]);

  const handleSelectSource = async (event: SourceEventSearchResult | null) => {
    setSelectedSource(event);
    setSource(null);
    setSourceRooms([]);
    setFieldSelections(emptyFieldSelections());
    setSelectedRoomIds(new Set());
    if (!event) return;

    setIsLoadingSource(true);
    setError(null);
    try {
      const details = await fetchSourceEventDetails(event.Event_ID);
      if (!details.source) {
        setError(`Event ${event.Event_ID} was not found.`);
        return;
      }
      setSource(details.source);
      setSourceRooms(details.rooms);
      // Default: every non-cancelled room that is not already on the target.
      setSelectedRoomIds(
        new Set(
          details.rooms
            .filter((r) => !r.Cancelled && !targetPairs.has(roomGroupKey(r.Room_ID, r.Group_ID)))
            .map((r) => r.Event_Room_ID),
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load the source event');
    } finally {
      setIsLoadingSource(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const infoContent = (
    <div className="space-y-2">
      <p className="font-semibold">{TOOL_TITLE}</p>
      <p className="text-sm">
        Copy fields and Rooms &amp; Groups from a previous event onto this one. Nothing is changed until you
        click Copy.
      </p>
    </div>
  );

  if (!targetEventId || targetEventId === -1) {
    return (
      <ToolContainer params={params} title={TOOL_TITLE} infoContent={infoContent} onClose={handleClose} hideFooter>
        <div className="px-6 py-4 text-sm text-muted-foreground">
          This tool must be launched from an Event record.
        </div>
      </ToolContainer>
    );
  }

  return (
    <ToolContainer params={params} title={TOOL_TITLE} infoContent={infoContent} onClose={handleClose} hideFooter>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading event...
          </div>
        ) : (
          <>
            {error && <div className="text-sm text-red-600 bg-red-50 rounded-md p-3">{error}</div>}

            {target && (
              <>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <CalendarDays className="w-4 h-4" />
                    Copying to
                  </h2>
                  <p className="text-base font-medium">{target.Event_Title}</p>
                  <p className="text-sm text-muted-foreground">
                    {[target.Congregation_Name, formatMpDateTime(target.Event_Start_Date, { weekday: true })]
                      .filter(Boolean)
                      .join(' · ')}
                    {series.length > 0 && ` · part of a series of ${series.length}`}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4" />
                    Copy from
                  </h2>
                  <SourceEventSearch
                    targetEventId={target.Event_ID}
                    initialResults={sameTitleEvents}
                    selected={selectedSource}
                    onSelect={handleSelectSource}
                    disabled={isLoadingSource}
                  />
                  {isLoadingSource && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading source event...
                    </div>
                  )}
                </div>

                {source && (
                  <>
                    {series.length > 0 && (
                      <SeriesScopeSection target={target} occurrences={series} scope={scope} onChange={setScope} />
                    )}

                    <FieldCopySection
                      source={source}
                      target={target}
                      selections={fieldSelections}
                      onChange={setFieldSelections}
                    />

                    <RoomCopySection
                      rooms={sourceRooms}
                      selectedIds={selectedRoomIds}
                      onSelectionChange={setSelectedRoomIds}
                      showCancelled={showCancelledRooms}
                      onShowCancelledChange={setShowCancelledRooms}
                      targetPairs={targetPairs}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </ToolContainer>
  );
}
