'use client';

import { useMemo } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Repeat } from 'lucide-react';
import { formatMpDateTime, resolveOccurrences } from '@/lib/copy-from-event-utils';
import type { SeriesOccurrence, SeriesScope } from '@/lib/dto';

interface SeriesScopeSectionProps {
  target: SeriesOccurrence;
  occurrences: SeriesOccurrence[];
  scope: SeriesScope;
  onChange: (scope: SeriesScope) => void;
  disabled?: boolean;
}

export function SeriesScopeSection({ target, occurrences, scope, onChange, disabled }: SeriesScopeSectionProps) {
  const counts = useMemo(
    () => ({
      this: 1,
      future: resolveOccurrences(target, occurrences, 'future').length,
      all: resolveOccurrences(target, occurrences, 'all').length,
    }),
    [target, occurrences],
  );

  const first = occurrences[0];
  const last = occurrences[occurrences.length - 1];

  const options: Array<{ value: SeriesScope; label: string; hint: string }> = [
    { value: 'this', label: 'Just this event', hint: formatMpDateTime(target.Event_Start_Date) },
    {
      value: 'future',
      label: `This event and all future occurrences (${counts.future})`,
      hint: `From ${formatMpDateTime(target.Event_Start_Date, { withTime: false })} onward`,
    },
    {
      value: 'all',
      label: `All occurrences in the series (${counts.all})`,
      hint:
        first && last
          ? `${formatMpDateTime(first.Event_Start_Date, { withTime: false })} to ${formatMpDateTime(last.Event_Start_Date, { withTime: false })}`
          : '',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
        <Repeat className="w-4 h-4" />
        Series
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        This event is part of a series of {occurrences.length}. Choose which occurrences receive the copy.
      </p>
      <RadioGroup value={scope} onValueChange={(v) => onChange(v as SeriesScope)} disabled={disabled}>
        {options.map((opt) => (
          <div key={opt.value} className="flex items-start gap-2">
            <RadioGroupItem value={opt.value} id={`scope-${opt.value}`} className="mt-0.5" />
            <Label htmlFor={`scope-${opt.value}`} className="font-normal cursor-pointer">
              <span className="block text-sm">{opt.label}</span>
              {opt.hint && <span className="block text-xs text-muted-foreground">{opt.hint}</span>}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
