'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ToolContainer } from '@/components/tool';
import {
  SourceEventSearch,
  FieldCopySection,
  RoomCopySection,
  SeriesScopeSection,
  CopyResultSummary,
} from '@/components/copy-from-event';
import {
  fetchCopyFromEventData,
  fetchSourceEventDetails,
  applyCopyFromEvent,
} from '@/components/copy-from-event/actions';
import { Loader2, CalendarDays, Search } from 'lucide-react';
import { formatMpDateTime, mergeText, resolveOccurrences, roomGroupKey } from '@/lib/copy-from-event-utils';
import { COPYABLE_FIELDS, emptyFieldSelections } from '@/lib/dto';
import type { ToolParams } from '@/lib/tool-params';
import type {
  ApplyCopyPayload,
  ApplyCopyResult,
  CopyableField,
  CopyableFieldDef,
  EventFieldValues,
  EventRoomRow,
  FieldCopyMode,
  FieldSelectionMap,
  SeriesOccurrence,
  SeriesScope,
  SourceEventSearchResult,
} from '@/lib/dto';

interface CopyFromEventProps {
  params: ToolParams;
}

const TOOL_TITLE = 'Copy From Event';

function sourceHasValue(def: CopyableFieldDef, source: EventFieldValues): boolean {
  const value = source[def.key];
  if (def.kind === 'text') return typeof value === 'string' && value.trim() !== '';
  return value !== null && value !== undefined;
}

function defaultRoomSelection(rooms: EventRoomRow[], targetPairs: Set<string>): Set<number> {
  return new Set(
    rooms
      .filter((r) => !r.Cancelled && !targetPairs.has(roomGroupKey(r.Room_ID, r.Group_ID)))
      .map((r) => r.Event_Room_ID),
  );
}

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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApplyCopyResult | null>(null);

  const targetPairs = useMemo(
    () => new Set(targetRooms.map((r) => roomGroupKey(r.Room_ID, r.Group_ID))),
    [targetRooms],
  );

  const loadTarget = useCallback(async (): Promise<Awaited<ReturnType<typeof fetchCopyFromEventData>> | null> => {
    if (!targetEventId || targetEventId === -1) return null;
    setError(null);
    try {
      const data = await fetchCopyFromEventData(targetEventId);
      if (!data.target) {
        setError(`Event ${targetEventId} was not found.`);
        return null;
      }
      setTarget(data.target);
      setSeries(data.series);
      setTargetRooms(data.targetRooms);
      setSameTitleEvents(data.sameTitleEvents);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load the event');
      return null;
    }
  }, [targetEventId]);

  useEffect(() => {
    // Initial data load on mount / target change; loader sets loading + data state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    loadTarget().finally(() => setIsLoading(false));
  }, [loadTarget]);

  const handleSelectSource = async (event: SourceEventSearchResult | null) => {
    setSelectedSource(event);
    setSource(null);
    setSourceRooms([]);
    setFieldSelections(emptyFieldSelections());
    setSelectedRoomIds(new Set());
    setResult(null);
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
      setSelectedRoomIds(defaultRoomSelection(details.rooms, targetPairs));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load the source event');
    } finally {
      setIsLoadingSource(false);
    }
  };

  // ---- Derived selection state -------------------------------------------

  const enabledFields = useMemo<Array<{ def: CopyableFieldDef; mode: FieldCopyMode }>>(() => {
    if (!source) return [];
    return COPYABLE_FIELDS.filter((def) => fieldSelections[def.key].enabled && sourceHasValue(def, source)).map(
      (def) => ({
        def,
        mode: def.kind === 'text' && fieldSelections[def.key].append ? 'append' : 'overwrite',
      }),
    );
  }, [source, fieldSelections]);

  const overLimitFields = useMemo(() => {
    if (!source || !target) return [];
    return enabledFields
      .filter(({ def, mode }) => def.kind === 'text' && def.maxLength !== undefined && mode === 'append')
      .filter(({ def }) => {
        const merged = mergeText(
          target[def.key] as string | null,
          source[def.key] as string | null,
          'append',
        );
        return (merged ?? '').length > (def.maxLength ?? Infinity);
      })
      .map(({ def }) => def.label);
  }, [enabledFields, source, target]);

  const roomIdsToCopy = useMemo(() => {
    const byId = new Map(sourceRooms.map((r) => [r.Event_Room_ID, r]));
    return Array.from(selectedRoomIds).filter((id) => {
      const row = byId.get(id);
      return row !== undefined && (!row.Cancelled || showCancelledRooms);
    });
  }, [selectedRoomIds, sourceRooms, showCancelledRooms]);

  const occurrencesInScope = useMemo(
    () => (target ? resolveOccurrences(target, series, scope) : []),
    [target, series, scope],
  );

  const hasAnythingSelected = enabledFields.length > 0 || roomIdsToCopy.length > 0;
  const occurrenceCount = occurrencesInScope.length;

  // ---- Save ---------------------------------------------------------------

  const handleSave = async () => {
    if (!target || !source) return;
    if (!hasAnythingSelected) {
      toast.error('Select at least one field or room to copy.');
      return;
    }
    if (overLimitFields.length > 0) {
      toast.error(`Appended text is too long for: ${overLimitFields.join(', ')}.`);
      return;
    }

    const fields: ApplyCopyPayload['fields'] = {};
    for (const { def, mode } of enabledFields) {
      fields[def.key as CopyableField] = { mode };
    }
    const payload: ApplyCopyPayload = {
      targetEventId: target.Event_ID,
      sourceEventId: source.Event_ID,
      scope,
      fields,
      sourceEventRoomIds: roomIdsToCopy,
    };

    setIsSaving(true);
    setError(null);
    try {
      const response = await applyCopyFromEvent(payload);
      if (!response.success) {
        setError(response.error);
        toast.error(response.error);
        return;
      }
      setResult(response);
      if (response.summary.failed > 0) {
        toast.error(`Copied with errors on ${response.summary.failed} of ${response.summary.occurrenceCount} event(s).`);
      } else {
        toast.success(
          `Copied to ${response.summary.occurrenceCount} event${response.summary.occurrenceCount === 1 ? '' : 's'}.`,
        );
      }

      // Refresh the target so "current" values and duplicate hints reflect what was written.
      const refreshed = await loadTarget();
      setFieldSelections(emptyFieldSelections());
      if (refreshed) {
        const pairs = new Set(refreshed.targetRooms.map((r) => roomGroupKey(r.Room_ID, r.Group_ID)));
        setSelectedRoomIds(defaultRoomSelection(sourceRooms, pairs));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Copy failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
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

  const summaryText = source
    ? `${enabledFields.length} field${enabledFields.length === 1 ? '' : 's'} · ${roomIdsToCopy.length} room${
        roomIdsToCopy.length === 1 ? '' : 's'
      } · ${occurrenceCount} event${occurrenceCount === 1 ? '' : 's'}`
    : '';

  return (
    <ToolContainer
      params={params}
      title={TOOL_TITLE}
      infoContent={infoContent}
      onClose={handleClose}
      onSave={handleSave}
      saveLabel={`Copy to ${occurrenceCount} event${occurrenceCount === 1 ? '' : 's'}`}
      isSaving={isSaving}
      hideFooter={!source || isLoading}
      footerExtra={
        source ? (
          <span className="text-sm text-muted-foreground">
            {summaryText}
            {!hasAnythingSelected && ' — nothing selected'}
          </span>
        ) : undefined
      }
    >
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
                    disabled={isLoadingSource || isSaving}
                  />
                  {isLoadingSource && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading source event...
                    </div>
                  )}
                </div>

                {result && <CopyResultSummary result={result} />}

                {source && (
                  <>
                    {series.length > 0 && (
                      <SeriesScopeSection
                        target={target}
                        occurrences={series}
                        scope={scope}
                        onChange={setScope}
                        disabled={isSaving}
                      />
                    )}

                    <FieldCopySection
                      source={source}
                      target={target}
                      selections={fieldSelections}
                      onChange={setFieldSelections}
                      disabled={isSaving}
                    />

                    <RoomCopySection
                      rooms={sourceRooms}
                      selectedIds={selectedRoomIds}
                      onSelectionChange={setSelectedRoomIds}
                      showCancelled={showCancelledRooms}
                      onShowCancelledChange={setShowCancelledRooms}
                      targetPairs={targetPairs}
                      disabled={isSaving}
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
