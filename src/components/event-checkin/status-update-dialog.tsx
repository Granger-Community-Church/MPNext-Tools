'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { ParticipationStatus } from '@/lib/dto';

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statuses: ParticipationStatus[];
  selectedCount: number;
  onConfirm: (statusId: number, timeIn: string | null) => Promise<void>;
}

/** Format a Date as `YYYY-MM-DDTHH:mm:ss` in local time (no timezone suffix). */
function toLocalISOString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/** Format a Date as `YYYY-MM-DDTHH:mm` for datetime-local input value. */
function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function StatusUpdateDialog({
  open,
  onOpenChange,
  statuses,
  selectedCount,
  onConfirm,
}: StatusUpdateDialogProps) {
  const [statusId, setStatusId] = useState<string>('');
  const [useNow, setUseNow] = useState(true);
  const [customTime, setCustomTime] = useState(toDatetimeLocalValue(new Date()));
  const [isUpdating, setIsUpdating] = useState(false);

  const handleConfirm = async () => {
    if (!statusId) return;
    setIsUpdating(true);
    try {
      let timeIn: string | null = null;
      if (useNow) {
        timeIn = toLocalISOString(new Date());
      } else if (customTime) {
        // datetime-local gives YYYY-MM-DDTHH:mm, append :00 for seconds
        timeIn = customTime.length === 16 ? `${customTime}:00` : customTime;
      }
      await onConfirm(parseInt(statusId, 10), timeIn);
      onOpenChange(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCustomTime(toDatetimeLocalValue(new Date()));
      setUseNow(true);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Participation Status</DialogTitle>
          <DialogDescription>
            Update status for {selectedCount} selected participant{selectedCount !== 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="status-select">Status</Label>
            <Select value={statusId} onValueChange={setStatusId}>
              <SelectTrigger id="status-select" className="w-full">
                <SelectValue placeholder="Select a status..." />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem
                    key={s.Participation_Status_ID}
                    value={String(s.Participation_Status_ID)}
                  >
                    {s.Participation_Status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="set-time-in"
                checked={useNow}
                onCheckedChange={(v) => setUseNow(v === true)}
              />
              <Label htmlFor="set-time-in" className="cursor-pointer">
                Set check-in time to now
              </Label>
            </div>

            {!useNow && (
              <div className="space-y-1.5 pl-6">
                <Label htmlFor="custom-time">Check-in time</Label>
                <Input
                  id="custom-time"
                  type="datetime-local"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep the existing check-in time.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!statusId || isUpdating}>
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
