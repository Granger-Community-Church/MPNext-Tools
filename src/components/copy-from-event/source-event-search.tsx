'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { ChevronsUpDown, Check, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchSourceEvents } from './actions';
import { formatMpDateTime } from '@/lib/copy-from-event-utils';
import type { SourceEventSearchResult } from '@/lib/dto';

interface SourceEventSearchProps {
  targetEventId: number;
  /** Shown before the user types: events sharing the target's title. */
  initialResults: SourceEventSearchResult[];
  selected: SourceEventSearchResult | null;
  onSelect: (event: SourceEventSearchResult | null) => void;
  disabled?: boolean;
}

function describe(event: SourceEventSearchResult): string {
  const parts = [event.Congregation_Name, formatMpDateTime(event.Event_Start_Date)];
  if (event.Room_Count !== undefined) {
    parts.push(`${event.Room_Count} room${event.Room_Count === 1 ? '' : 's'}`);
  }
  return parts.filter(Boolean).join(' · ');
}

export function SourceEventSearch({
  targetEventId,
  initialResults,
  selected,
  onSelect,
  disabled,
}: SourceEventSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SourceEventSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(
    async (term: string) => {
      if (term.trim().length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        setResults(await searchSourceEvents(term, targetEventId));
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [targetEventId],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  const showingInitial = query.trim().length < 2;
  const list = showingInitial ? initialResults : results;

  const choose = (event: SourceEventSearchResult | null) => {
    onSelect(event);
    setOpen(false);
    setQuery('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-auto min-h-9 py-1.5"
          disabled={disabled}
        >
          {selected ? (
            <span className="flex flex-col items-start text-left truncate">
              <span className="flex items-center gap-2 truncate">
                <CalendarDays className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                {selected.Event_Title}
              </span>
              <span className="text-xs text-muted-foreground truncate">{describe(selected)}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Search for the event to copy from...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Type an event title..." value={query} onValueChange={setQuery} />
          <CommandList>
            {isSearching && (
              <div className="py-4 text-center text-sm text-muted-foreground">Searching...</div>
            )}
            {!isSearching && !showingInitial && results.length === 0 && (
              <CommandEmpty>No events found.</CommandEmpty>
            )}
            {!isSearching && showingInitial && initialResults.length === 0 && (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Type at least 2 characters to search
              </div>
            )}
            {selected && (
              <CommandGroup>
                <CommandItem value="clear" onSelect={() => choose(null)} className="text-muted-foreground">
                  Clear selection
                </CommandItem>
              </CommandGroup>
            )}
            {!isSearching && list.length > 0 && (
              <CommandGroup heading={showingInitial ? 'Same title as this event' : undefined}>
                {list.map((event) => (
                  <CommandItem
                    key={event.Event_ID}
                    value={String(event.Event_ID)}
                    onSelect={() => choose(event)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selected?.Event_ID === event.Event_ID ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">{event.Event_Title}</span>
                      <span className="text-xs text-muted-foreground truncate">{describe(event)}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
