'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { NametagConfig, NametagLayout } from '@/lib/dto';

interface NametagConfigFormProps {
  config: NametagConfig;
  onChange: (config: NametagConfig) => void;
}

export function NametagConfigForm({ config, onChange }: NametagConfigFormProps) {
  return (
    <div className="flex items-end gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="nametag-layout">Name Format</Label>
        <Select
          value={config.layout}
          onValueChange={(v) => onChange({ ...config, layout: v as NametagLayout })}
        >
          <SelectTrigger id="nametag-layout">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="first-last-initial">First + Last Initial</SelectItem>
            <SelectItem value="first-last-full">First + Last (Full)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="start-position">Start Position</Label>
        <Input
          id="start-position"
          type="number"
          min={1}
          max={8}
          className="w-20"
          value={config.startPosition}
          onChange={(e) =>
            onChange({
              ...config,
              startPosition: Math.max(1, Math.min(8, parseInt(e.target.value, 10) || 1)),
            })
          }
        />
      </div>
    </div>
  );
}
