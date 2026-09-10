'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mergeText } from '@/lib/copy-from-event-utils';
import type { CopyableFieldDef, EventFieldValues, FieldSelection } from '@/lib/dto';

interface FieldCopyRowProps {
  def: CopyableFieldDef;
  source: EventFieldValues;
  target: EventFieldValues;
  selection: FieldSelection;
  onChange: (selection: FieldSelection) => void;
  disabled?: boolean;
}

function fkDisplay(event: EventFieldValues, def: CopyableFieldDef): { text: string; empty: boolean } {
  const id = event[def.key] as number | null;
  if (id === null || id === undefined) return { text: '—', empty: true };
  const name = def.nameKey ? event[def.nameKey] : null;
  return { text: name ? `${name}  (ID ${id})` : `ID ${id}`, empty: false };
}

function textIsEmpty(value: string | null): boolean {
  return value === null || value.trim() === '';
}

export function FieldCopyRow({ def, source, target, selection, onChange, disabled }: FieldCopyRowProps) {
  const isText = def.kind === 'text';
  const sourceValue = source[def.key];
  const targetValue = target[def.key];

  const sourceEmpty = isText ? textIsEmpty(sourceValue as string | null) : sourceValue === null;
  const targetHasValue = isText ? !textIsEmpty(targetValue as string | null) : targetValue !== null;

  const enabled = selection.enabled && !sourceEmpty;
  const append = isText && selection.append;
  const willOverwrite = enabled && targetHasValue && !append;

  const appendedLength =
    enabled && append && isText
      ? (mergeText(targetValue as string | null, sourceValue as string | null, 'append') ?? '').length
      : null;
  const overLimit = appendedLength !== null && def.maxLength !== undefined && appendedLength > def.maxLength;

  const enableId = `copy-${def.key}`;
  const appendId = `append-${def.key}`;

  return (
    <div className={cn('rounded-md border p-3 space-y-2', willOverwrite && 'border-amber-300 bg-amber-50/40')}>
      <div className="flex items-start gap-2">
        <Checkbox
          id={enableId}
          checked={enabled}
          disabled={disabled || sourceEmpty}
          onCheckedChange={(checked) => onChange({ ...selection, enabled: checked === true })}
          className="mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <Label htmlFor={enableId} className={cn('cursor-pointer', sourceEmpty && 'text-muted-foreground')}>
            {def.label}
            {sourceEmpty && <span className="ml-2 text-xs font-normal">(nothing to copy)</span>}
          </Label>
          {isText && (
            <div className="mt-1 flex items-center gap-2">
              <Checkbox
                id={appendId}
                checked={append}
                disabled={disabled || !enabled}
                onCheckedChange={(checked) => onChange({ ...selection, append: checked === true })}
              />
              <Label
                htmlFor={appendId}
                className={cn('text-xs font-normal cursor-pointer', !enabled && 'text-muted-foreground')}
              >
                Append to existing text instead of replacing it
              </Label>
              {appendedLength !== null && def.maxLength !== undefined && (
                <span className={cn('ml-auto text-xs tabular-nums', overLimit ? 'text-red-600 font-medium' : 'text-muted-foreground')}>
                  {appendedLength.toLocaleString()} / {def.maxLength.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {willOverwrite && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 p-2 text-xs text-amber-900">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>The target already has a value. It will be replaced.</span>
        </div>
      )}
      {overLimit && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 p-2 text-xs text-red-800">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Appended text would exceed the {def.maxLength?.toLocaleString()} character limit for this field.</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <ValueCell label="Source" value={isText ? (sourceValue as string | null) : fkDisplay(source, def).text} isText={isText} />
        <ValueCell label="Current on target" value={isText ? (targetValue as string | null) : fkDisplay(target, def).text} isText={isText} />
      </div>
    </div>
  );
}

function ValueCell({ label, value, isText }: { label: string; value: string | null; isText: boolean }) {
  const empty = value === null || value.trim() === '' || value === '—';
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      {empty ? (
        <p className="text-sm text-muted-foreground">{'—'}</p>
      ) : isText ? (
        // Rendered as text on purpose: these fields commonly contain HTML.
        <div className="text-xs whitespace-pre-wrap break-words max-h-40 overflow-auto rounded border bg-muted/30 p-2 font-mono">
          {value}
        </div>
      ) : (
        <p className="text-sm">{value}</p>
      )}
    </div>
  );
}
