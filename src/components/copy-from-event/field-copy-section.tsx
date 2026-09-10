'use client';

import { FileText } from 'lucide-react';
import { COPYABLE_FIELDS } from '@/lib/dto';
import type { EventFieldValues, FieldSelectionMap } from '@/lib/dto';
import { FieldCopyRow } from './field-copy-row';

interface FieldCopySectionProps {
  source: EventFieldValues;
  target: EventFieldValues;
  selections: FieldSelectionMap;
  onChange: (selections: FieldSelectionMap) => void;
  disabled?: boolean;
}

export function FieldCopySection({ source, target, selections, onChange, disabled }: FieldCopySectionProps) {
  const enabledCount = COPYABLE_FIELDS.filter((f) => selections[f.key].enabled).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Event fields
        </h2>
        <span className="text-sm text-muted-foreground">{enabledCount} selected</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Check a field to copy it from the source. Nothing is selected by default.
      </p>
      <div className="space-y-3">
        {COPYABLE_FIELDS.map((def) => (
          <FieldCopyRow
            key={def.key}
            def={def}
            source={source}
            target={target}
            selection={selections[def.key]}
            onChange={(selection) => onChange({ ...selections, [def.key]: selection })}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
