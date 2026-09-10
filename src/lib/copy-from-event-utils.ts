import { EVENT_ROOM_COPY_COLUMNS } from '@/lib/dto';
import type {
  EventRoomCreate,
  EventRoomRow,
  FieldCopyMode,
  SeriesOccurrence,
  SeriesScope,
} from '@/lib/dto';

/**
 * Pure helpers shared by the Copy From Event service (server) and its
 * components (client). Nothing here touches MP or React.
 */

const HTML_TAG_RE = /<\/?[a-z][^>]*>/i;

export function looksLikeHtml(value: string | null | undefined): boolean {
  return typeof value === 'string' && HTML_TAG_RE.test(value);
}

/**
 * Computes the new value for a text field.
 * - overwrite: the source value (may be null).
 * - append: existing + separator + source. Falls back to plain overwrite when
 *   the target is empty, and leaves the target untouched when the source is empty.
 * The separator is `<br><br>` when either side contains HTML (these fields are
 * edited with MP's rich-text editor in practice), otherwise two newlines.
 */
export function mergeText(
  existing: string | null,
  source: string | null,
  mode: FieldCopyMode,
): string | null {
  if (mode === 'overwrite') return source;
  const src = source ?? '';
  const cur = existing ?? '';
  if (src.trim() === '') return existing;
  if (cur.trim() === '') return source;
  const separator = looksLikeHtml(cur) || looksLikeHtml(src) ? '<br><br>' : '\n\n';
  return `${cur}${separator}${src}`;
}

/** Idempotency key for an Event_Rooms row on a given event. */
export function pairKey(eventId: number, roomId: number, groupId: number | null): string {
  return `${eventId}:${roomId}:${groupId ?? 'null'}`;
}

/** Room+Group key independent of event, for "already on target" hints in the UI. */
export function roomGroupKey(roomId: number, groupId: number | null): string {
  return `${roomId}:${groupId ?? 'null'}`;
}

/**
 * Display label for a room row's group: "5th Grade Volunteers (Elkhart Campus)".
 * Groups with the same name exist per campus, so the congregation disambiguates.
 */
export function formatGroupLabel(
  row: Pick<EventRoomRow, 'Group_Name' | 'Group_Congregation_Name'>,
): string | null {
  if (!row.Group_Name) return null;
  return row.Group_Congregation_Name ? `${row.Group_Name} (${row.Group_Congregation_Name})` : row.Group_Name;
}

/** Builds the create record for a target event from a source row. */
export function toRoomCreate(row: EventRoomRow, targetEventId: number): EventRoomCreate {
  const record = { Event_ID: targetEventId, Cancelled: false as const } as Record<string, unknown>;
  for (const column of EVENT_ROOM_COPY_COLUMNS) {
    record[column] = row[column] ?? null;
  }
  return record as EventRoomCreate;
}

/**
 * MP returns datetimes as wall-clock strings (`YYYY-MM-DDTHH:mm:ss`). Both sides
 * of every comparison here come from the MP API in that same format, so a lexical
 * compare of the normalized prefix orders them correctly without any timezone math.
 */
export function mpDatetimeKey(value: string): string {
  return value.trim().slice(0, 19);
}

/** Pure scope filter. Always includes the target itself, deduped by Event_ID, sorted by start. */
export function resolveOccurrences(
  target: SeriesOccurrence,
  seriesOccurrences: SeriesOccurrence[],
  scope: SeriesScope,
): SeriesOccurrence[] {
  if (scope === 'this') return [target];

  const targetKey = mpDatetimeKey(target.Event_Start_Date);
  const seen = new Set<number>();
  const result: SeriesOccurrence[] = [];

  const candidates = [...seriesOccurrences].sort((a, b) =>
    mpDatetimeKey(a.Event_Start_Date).localeCompare(mpDatetimeKey(b.Event_Start_Date)),
  );
  for (const occ of candidates) {
    if (scope === 'future' && mpDatetimeKey(occ.Event_Start_Date) < targetKey) continue;
    if (seen.has(occ.Event_ID)) continue;
    seen.add(occ.Event_ID);
    result.push(occ);
  }
  if (!seen.has(target.Event_ID)) {
    result.push(target);
  }
  return result;
}

const WALL_CLOCK_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/;

/**
 * Formats an MP wall-clock datetime string for display **without** interpreting
 * it in the browser's time zone. The parts are anchored to UTC and formatted in
 * UTC, so the text shows exactly the wall-clock MP stores (see
 * `.claude/references/ministryplatform.datetimehandling.md`).
 */
export function formatMpDateTime(
  value: string | null | undefined,
  opts: { withTime?: boolean; weekday?: boolean } = {},
): string {
  if (!value) return '—';
  const m = WALL_CLOCK_RE.exec(value.trim());
  if (!m) return value;
  const [, y, mo, d, h = '0', mi = '0'] = m;
  const instant = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi)));
  const withTime = opts.withTime ?? true;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    ...(opts.weekday ? { weekday: 'short' } : {}),
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  }).format(instant);
}
