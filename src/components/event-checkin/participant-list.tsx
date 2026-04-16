'use client';

import { useState, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EventParticipantRow, ParticipationStatus } from '@/lib/dto';

const EXCLUDED_STATUS_IDS = new Set([5, 20]); // Cancelled, Abandoned

interface ParticipantListProps {
  participants: EventParticipantRow[];
  statuses: ParticipationStatus[];
  selectedIds: Set<number>;
  onSelectionChange: (ids: Set<number>) => void;
}

function formatTimeIn(timeIn: string | null): string {
  if (!timeIn) return '\u2014';
  return new Date(timeIn).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getDisplayName(row: EventParticipantRow): string {
  const first = row.Nickname || row.First_Name;
  return `${first} ${row.Last_Name}`;
}

export function ParticipantList({
  participants,
  statuses,
  selectedIds,
  onSelectionChange,
}: ParticipantListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('2'); // Default: Registered

  // Statuses that actually appear in the participant list, excluding hidden ones
  const availableStatuses = useMemo(() => {
    const presentIds = new Set(participants.map((p) => p.Participation_Status_ID));
    return statuses.filter(
      (s) => !EXCLUDED_STATUS_IDS.has(s.Participation_Status_ID) && presentIds.has(s.Participation_Status_ID),
    );
  }, [participants, statuses]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') {
      return participants.filter((p) => !EXCLUDED_STATUS_IDS.has(p.Participation_Status_ID));
    }
    const id = parseInt(statusFilter, 10);
    return participants.filter((p) => p.Participation_Status_ID === id);
  }, [participants, statusFilter]);

  const allFilteredSelected =
    filtered.length > 0 &&
    filtered.every((p) => selectedIds.has(p.Event_Participant_ID));

  const someFilteredSelected =
    !allFilteredSelected &&
    filtered.some((p) => selectedIds.has(p.Event_Participant_ID));

  const handleSelectAll = () => {
    const next = new Set(selectedIds);
    if (allFilteredSelected) {
      for (const p of filtered) next.delete(p.Event_Participant_ID);
    } else {
      for (const p of filtered) next.add(p.Event_Participant_ID);
    }
    onSelectionChange(next);
  };

  const handleToggle = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const countForStatus = (id: number) =>
    participants.filter((p) => p.Participation_Status_ID === id).length;

  const allCount = participants.filter((p) => !EXCLUDED_STATUS_IDS.has(p.Participation_Status_ID)).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({allCount})</SelectItem>
            {availableStatuses.map((s) => (
              <SelectItem key={s.Participation_Status_ID} value={String(s.Participation_Status_ID)}>
                {s.Participation_Status} ({countForStatus(s.Participation_Status_ID)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {selectedIds.size} selected
        </span>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-10 px-3 py-2">
                <Checkbox
                  checked={allFilteredSelected ? true : someFilteredSelected ? 'indeterminate' : false}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </th>
              <th className="text-left px-3 py-2 font-medium">Name</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">Time In</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-muted-foreground">
                  No participants found
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.Event_Participant_ID}
                  className="border-t hover:bg-muted/30 cursor-pointer"
                  onClick={() => handleToggle(p.Event_Participant_ID)}
                >
                  <td className="px-3 py-2">
                    <Checkbox
                      checked={selectedIds.has(p.Event_Participant_ID)}
                      onCheckedChange={() => handleToggle(p.Event_Participant_ID)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${getDisplayName(p)}`}
                    />
                  </td>
                  <td className="px-3 py-2">{getDisplayName(p)}</td>
                  <td className="px-3 py-2">
                    <Badge variant="secondary">{p.Participation_Status}</Badge>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {formatTimeIn(p.Time_In)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
