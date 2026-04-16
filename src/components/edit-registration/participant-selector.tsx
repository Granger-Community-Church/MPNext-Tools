'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import type { ParticipantGridRow } from '@/lib/dto';

interface ParticipantSelectorProps {
  participants: ParticipantGridRow[];
  selectedId: number | null;
  isLoadingDetails: boolean;
  onSelect: (participantId: number) => void;
  renderEditPanel: (participantId: number) => React.ReactNode;
}

function getStatusStyle(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('registered')) {
    return 'bg-green-100 text-green-900';
  }
  if (s.includes('cancelled')) {
    return 'bg-pink-100 text-pink-900';
  }
  if (s.includes('abandoned') || s.includes('waiting for payment')) {
    return 'bg-amber-100 text-amber-900';
  }
  return 'bg-gray-100 text-gray-900';
}

export function ParticipantSelector({
  participants,
  selectedId,
  isLoadingDetails,
  onSelect,
  renderEditPanel,
}: ParticipantSelectorProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return participants;
    const term = search.toLowerCase();
    return participants.filter(
      (p) =>
        p.Display_Name.toLowerCase().includes(term) ||
        p.Participation_Status.toLowerCase().includes(term) ||
        p.ProductOptions.some((o) => o.toLowerCase().includes(term)),
    );
  }, [participants, search]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search participants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-8 px-2 py-2" />
              <th className="text-left px-3 py-2 font-medium">Name</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">Product Options</th>
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
              filtered.map((p) => {
                const isSelected = p.Event_Participant_ID === selectedId;
                return (
                  <ParticipantRow
                    key={p.Event_Participant_ID}
                    participant={p}
                    isSelected={isSelected}
                    isLoadingDetails={isLoadingDetails && isSelected}
                    onSelect={onSelect}
                    renderEditPanel={renderEditPanel}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-muted-foreground">
        {filtered.length} of {participants.length} participants
      </div>
    </div>
  );
}

function ParticipantRow({
  participant: p,
  isSelected,
  isLoadingDetails,
  onSelect,
  renderEditPanel,
}: {
  participant: ParticipantGridRow;
  isSelected: boolean;
  isLoadingDetails: boolean;
  onSelect: (id: number) => void;
  renderEditPanel: (id: number) => React.ReactNode;
}) {
  const statusStyle = getStatusStyle(p.Participation_Status);

  return (
    <>
      <tr
        className={`border-t cursor-pointer ${
          isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'
        }`}
        onClick={() => onSelect(p.Event_Participant_ID)}
      >
        <td className="px-2 py-2 text-muted-foreground">
          {isSelected ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </td>
        <td className="px-3 py-2 font-medium">{p.Display_Name}</td>
        <td className="px-3 py-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle}`}
          >
            {p.Participation_Status}
          </span>
        </td>
        <td className="px-3 py-2 text-muted-foreground">
          {p.ProductOptions.length > 0 ? p.ProductOptions.join(', ') : '\u2014'}
        </td>
      </tr>
      {isSelected && (
        <tr>
          <td colSpan={4} className="bg-muted/20 border-t px-4 py-4">
            {isLoadingDetails ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading registration details...
              </div>
            ) : (
              renderEditPanel(p.Event_Participant_ID)
            )}
          </td>
        </tr>
      )}
    </>
  );
}
