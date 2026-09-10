'use client';

import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMpDateTime } from '@/lib/copy-from-event-utils';
import { COPYABLE_FIELDS } from '@/lib/dto';
import type { ApplyCopyResult, CopyableField } from '@/lib/dto';

interface CopyResultSummaryProps {
  result: ApplyCopyResult;
}

function fieldLabel(key: CopyableField): string {
  return COPYABLE_FIELDS.find((f) => f.key === key)?.label ?? key;
}

export function CopyResultSummary({ result }: CopyResultSummaryProps) {
  const { summary, occurrences } = result;
  const allFailed = summary.failed > 0 && summary.failed === summary.occurrenceCount;
  const tone = allFailed ? 'error' : summary.failed > 0 ? 'partial' : 'ok';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div
        className={cn(
          'flex items-start gap-2 rounded-md p-3 text-sm mb-4',
          tone === 'ok' && 'bg-green-50 text-green-800',
          tone === 'partial' && 'bg-amber-50 text-amber-900',
          tone === 'error' && 'bg-red-50 text-red-800',
        )}
      >
        {tone === 'ok' && <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />}
        {tone === 'partial' && <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />}
        {tone === 'error' && <XCircle className="h-4 w-4 mt-0.5 shrink-0" />}
        <div>
          <p className="font-medium">
            {summary.occurrenceCount === 1 ? '1 event' : `${summary.occurrenceCount} events`} processed
            {summary.failed > 0 && `, ${summary.failed} with errors`}
          </p>
          <p className="text-xs mt-0.5">
            {summary.fieldsUpdated} field{summary.fieldsUpdated === 1 ? '' : 's'} updated ·{' '}
            {summary.roomsCreated} room{summary.roomsCreated === 1 ? '' : 's'} added
            {summary.roomsSkipped > 0 && ` · ${summary.roomsSkipped} already present, skipped`}
            {summary.roomsCreated > 0 && ' · new rooms are pending approval'}
          </p>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Event</th>
                <th className="text-left px-3 py-2 font-medium">Fields updated</th>
                <th className="text-right px-3 py-2 font-medium">Rooms added</th>
                <th className="text-right px-3 py-2 font-medium">Skipped</th>
                <th className="text-left px-3 py-2 font-medium">Errors</th>
              </tr>
            </thead>
            <tbody>
              {occurrences.map((o) => {
                const failed = Boolean(o.fieldError || o.roomError);
                return (
                  <tr key={o.Event_ID} className={cn('border-t', failed ? 'bg-red-50/50' : 'bg-green-50/30')}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {formatMpDateTime(o.Event_Start_Date)}
                      <span className="ml-2 text-xs text-muted-foreground">#{o.Event_ID}</span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {o.fieldsUpdated.length > 0 ? o.fieldsUpdated.map(fieldLabel).join(', ') : '—'}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{o.roomsCreated}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{o.roomsSkipped}</td>
                    <td className="px-3 py-2 text-red-700 text-xs">
                      {[o.fieldError && `Fields: ${o.fieldError}`, o.roomError && `Rooms: ${o.roomError}`]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
