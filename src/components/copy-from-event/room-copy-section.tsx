'use client';

import { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DoorOpen } from 'lucide-react';
import { formatGroupLabel, roomGroupKey } from '@/lib/copy-from-event-utils';
import type { EventRoomRow } from '@/lib/dto';

interface RoomCopySectionProps {
  rooms: EventRoomRow[];
  selectedIds: Set<number>;
  onSelectionChange: (ids: Set<number>) => void;
  showCancelled: boolean;
  onShowCancelledChange: (show: boolean) => void;
  /** `roomGroupKey`s of non-cancelled rows already on the target event. */
  targetPairs: Set<string>;
  disabled?: boolean;
}

export function RoomCopySection({
  rooms,
  selectedIds,
  onSelectionChange,
  showCancelled,
  onShowCancelledChange,
  targetPairs,
  disabled,
}: RoomCopySectionProps) {
  const visible = useMemo(
    () => (showCancelled ? rooms : rooms.filter((r) => !r.Cancelled)),
    [rooms, showCancelled],
  );
  const cancelledCount = rooms.length - rooms.filter((r) => !r.Cancelled).length;

  const allSelected = visible.length > 0 && visible.every((r) => selectedIds.has(r.Event_Room_ID));
  const someSelected = !allSelected && visible.some((r) => selectedIds.has(r.Event_Room_ID));

  const handleSelectAll = () => {
    const next = new Set(selectedIds);
    if (allSelected) {
      for (const r of visible) next.delete(r.Event_Room_ID);
    } else {
      for (const r of visible) next.add(r.Event_Room_ID);
    }
    onSelectionChange(next);
  };

  const handleToggle = (id: number) => {
    if (disabled) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <DoorOpen className="w-4 h-4" />
          Rooms &amp; Groups
        </h2>
        <div className="flex items-center gap-4">
          {cancelledCount > 0 && (
            <div className="flex items-center gap-2">
              <Switch
                id="show-cancelled-rooms"
                checked={showCancelled}
                onCheckedChange={onShowCancelledChange}
                disabled={disabled}
              />
              <Label htmlFor="show-cancelled-rooms" className="text-xs font-normal cursor-pointer">
                Show cancelled ({cancelledCount})
              </Label>
            </div>
          )}
          <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-10 px-3 py-2">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                    onCheckedChange={handleSelectAll}
                    disabled={disabled || visible.length === 0}
                    aria-label="Select all rooms"
                  />
                </th>
                <th className="text-left px-3 py-2 font-medium">Building</th>
                <th className="text-left px-3 py-2 font-medium">Room</th>
                <th className="text-left px-3 py-2 font-medium">Group</th>
                <th className="text-left px-3 py-2 font-medium">Layout</th>
                <th className="text-left px-3 py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-muted-foreground">
                    The source event has no rooms to copy
                  </td>
                </tr>
              ) : (
                visible.map((r) => {
                  const onTarget = targetPairs.has(roomGroupKey(r.Room_ID, r.Group_ID));
                  const groupLabel = formatGroupLabel(r);
                  return (
                    <tr
                      key={r.Event_Room_ID}
                      className="border-t hover:bg-muted/30 cursor-pointer"
                      onClick={() => handleToggle(r.Event_Room_ID)}
                    >
                      <td className="px-3 py-2">
                        <Checkbox
                          checked={selectedIds.has(r.Event_Room_ID)}
                          onCheckedChange={() => handleToggle(r.Event_Room_ID)}
                          onClick={(e) => e.stopPropagation()}
                          disabled={disabled}
                          aria-label={`Select ${r.Room_Name}${groupLabel ? ` / ${groupLabel}` : ''}`}
                        />
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{r.Building_Name ?? '—'}</td>
                      <td className="px-3 py-2">{r.Room_Name}</td>
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-2 flex-wrap">
                          {groupLabel ?? <span className="text-muted-foreground">{'—'}</span>}
                          {onTarget && <Badge variant="secondary">Already on target</Badge>}
                          {r.Cancelled && <Badge variant="outline">Cancelled</Badge>}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{r.Layout_Name ?? '—'}</td>
                      <td className="px-3 py-2 text-muted-foreground max-w-[16rem] truncate" title={r.Notes ?? undefined}>
                        {r.Notes ?? '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Rows already on a target event (same room and group) are skipped when copying. New rows are created
        unapproved and follow the normal room-approval workflow.
      </p>
    </div>
  );
}
