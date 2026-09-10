---
title: Copy From Event component
domain: components
type: reference
applies_to:
  - src/components/copy-from-event/actions.ts
  - src/components/copy-from-event/actions.test.ts
  - src/components/copy-from-event/copy-result-summary.tsx
  - src/components/copy-from-event/field-copy-row.tsx
  - src/components/copy-from-event/field-copy-section.tsx
  - src/components/copy-from-event/index.ts
  - src/components/copy-from-event/room-copy-section.tsx
  - src/components/copy-from-event/series-scope-section.tsx
  - src/components/copy-from-event/source-event-search.tsx
  - src/app/(web)/tools/copyfromevent/copy-from-event.tsx
  - src/app/(web)/tools/copyfromevent/page.tsx
  - src/services/copyFromEventService.ts
  - src/lib/copy-from-event-utils.ts
  - src/lib/dto/copy-from-event.dto.ts
symbols:
  - CopyFromEvent
  - SourceEventSearch
  - FieldCopySection
  - FieldCopyRow
  - RoomCopySection
  - SeriesScopeSection
  - CopyResultSummary
  - fetchCopyFromEventData
  - searchSourceEvents
  - fetchSourceEventDetails
  - applyCopyFromEvent
  - CopyFromEventService
  - EventRoomCreateSchema
  - resolveOccurrences
  - mergeText
  - formatMpDateTime
related:
  - tool-framework.md
  - ../services/query-patterns.md
  - ../ministryplatform.datetimehandling.md
  - ../granger/copy-moore/README.md
last_verified: 2026-09-10
---

## Purpose
Launched from an open Event record, lets staff pick a prior "source" event and copy chosen `Events` fields and `Event_Rooms` rows onto the **existing** target event, optionally fanning out to other occurrences of the target's series. It never creates events. Consumed by `/tools/copyfromevent`.

## Files
| File | Role |
|---|---|
| `src/app/(web)/tools/copyfromevent/page.tsx` | Server page: `parseToolParams`, renders `CopyFromEvent` |
| `src/app/(web)/tools/copyfromevent/copy-from-event.tsx` | Client shell: owns all state, loads target, wires footer Copy button |
| `src/components/copy-from-event/actions.ts` | Server actions (auth guard → `CopyFromEventService`) |
| `src/components/copy-from-event/source-event-search.tsx` | Popover + Command type-ahead on `Event_Title`, 300 ms debounce, same-title prefill |
| `src/components/copy-from-event/field-copy-section.tsx` / `field-copy-row.tsx` | Mass-Assign-style rows: enable checkbox, Append checkbox (text fields), overwrite cue, source vs target values |
| `src/components/copy-from-event/room-copy-section.tsx` | `Event_Rooms` checklist with select-all, cancelled toggle, "Already on target" badge; group shown as `Name (Congregation)` via `formatGroupLabel` |
| `src/components/copy-from-event/series-scope-section.tsx` | Radio: this event / this and future / all occurrences |
| `src/components/copy-from-event/copy-result-summary.tsx` | Per-occurrence result table after apply |
| `src/services/copyFromEventService.ts` | Queries, `api_Common_GetEventsInSeries`, apply orchestration |
| `src/lib/copy-from-event-utils.ts` | Pure helpers shared by server and client (`mergeText`, `resolveOccurrences`, `toRoomCreate`, `formatMpDateTime`, keys) |
| `src/lib/dto/copy-from-event.dto.ts` | DTOs, `COPYABLE_FIELDS`, `EVENT_ROOM_COPY_COLUMNS`, `EventRoomCreateSchema` |

## Key concepts
- **Copyable fields**: `Meeting_Instructions` (4000), `Description` (2000), `Additional_Description` (text), `Online_Registration_Product`, `Registration_Form`, `Registrant_Group`. Defined once in `COPYABLE_FIELDS` with kind, max length, and the FK display-name key.
- **Overwrite vs append**: every field defaults to off. Checking it means overwrite; text fields have a second Append checkbox. `mergeText` joins with `<br><br>` when either side contains HTML (these fields are edited in MP's rich-text editor), else `\n\n`. Append onto an empty target degrades to overwrite; an empty source leaves the target untouched.
- **Series**: defined by `dp_Sequences`, which the tables API does not expose. `getSeriesOccurrences` calls `api_Common_GetEventsInSeries(@EventID)` and reads `result[0]` (full Event rows; empty for a standalone event). `resolveOccurrences(target, series, scope)` is pure: `this` → target; `future` → start date >= target's; `all` → everything. The server re-resolves scope on apply; the client never sends an occurrence list.
- **Rooms idempotency**: key is `(Event_ID, Room_ID, Group_ID)` among non-cancelled rows (`pairKey`). Existing pairs are skipped and counted. Source rows with a duplicate pair are copied once.
- **Room create record**: `toRoomCreate` copies exactly `EVENT_ROOM_COPY_COLUMNS`, sets `Event_ID` and `Cancelled: false`, and omits `Event_Room_ID`, `_Approved`, `_Tech_Approved`, `_Reservation_Start`, `_Reservation_End`. New rows land unapproved.
- **Per-occurrence isolation**: fields and rooms are separate try/catch blocks per occurrence, run sequentially in date order. A failure sets `fieldError` / `roomError` on that occurrence and the rest continue.

## API / Interface

### Server actions — `actions.ts`
```typescript
fetchCopyFromEventData(targetEventId): Promise<{ target; series; targetRooms; sameTitleEvents }>
searchSourceEvents(term, excludeEventId): Promise<SourceEventSearchResult[]>
fetchSourceEventDetails(sourceEventId): Promise<{ source; rooms /* incl. cancelled */ }>
applyCopyFromEvent(payload: ApplyCopyPayload): Promise<ApplyCopyResult | { success: false; error }>
```
All call the local `getSession()` guard. `applyCopyFromEvent` resolves `$userId` via `getCurrentUserIdFromSession` (GOTCHA-007) and wraps service errors.

### Payload / result — `copy-from-event.dto.ts`
```typescript
interface ApplyCopyPayload {
  targetEventId: number; sourceEventId: number; scope: 'this' | 'future' | 'all';
  fields: Partial<Record<CopyableField, { mode: 'overwrite' | 'append' }>>;   // only enabled fields
  sourceEventRoomIds: number[];                                                // Event_Room_IDs on the source
}
interface ApplyCopyResult {
  success: true;
  occurrences: { Event_ID; Event_Start_Date; fieldsUpdated; roomsCreated; roomsSkipped; fieldError?; roomError? }[];
  summary: { occurrenceCount; fieldsUpdated; roomsCreated; roomsSkipped; failed };
}
```

### Service queries — `copyFromEventService.ts`
Every base column is qualified (`Events.X`, `Event_Rooms.X`) because every select joins tables with colliding names (GOTCHA-012).

| Method | Table / proc | Notes |
|---|---|---|
| `getEventFieldValues(id)` | `Events` + `Congregation_ID_TABLE`, `Online_Registration_Product_TABLE.Product_Name`, `Registration_Form_TABLE.Form_Title`, `Registrant_Group_TABLE.Group_Name` | |
| `getEventFieldValuesForIds(ids)` | same, `IN (...)` batched at `MP_FETCH_BATCH_SIZE` | |
| `getSeriesOccurrences(id)` | `api_Common_GetEventsInSeries` | `[]` for standalone |
| `searchEvents({ term \| exactTitle, excludeEventId })` | `Events`, `LIKE` via `escapeFilterString` or `=` via quote doubling | newest first, top 25 |
| `getRoomCounts(ids)` | `Event_Rooms` grouped `COUNT(Event_Room_ID)` | swallows errors → empty map |
| `getEventRooms(id, { includeCancelled })` | `Event_Rooms` + `Room_ID_TABLE.Room_Name`, `Room_ID_TABLE_Building_ID_TABLE.Building_Name`, `Group_ID_TABLE.Group_Name`, `Group_ID_TABLE_Congregation_ID_TABLE.Congregation_Name AS Group_Congregation_Name`, `Room_Layout_ID_TABLE.Layout_Name` | |
| `getExistingRoomPairs(ids)` | `Event_Rooms` `Event_ID, Room_ID, Group_ID`, non-cancelled | |
| `updateEventFields(id, patch, userId)` | `updateTableRecords('Events')` **without** a schema | see Gotchas |
| `createEventRooms(records, userId)` | `createTableRecords('Event_Rooms', …, { schema: EventRoomCreateSchema })` | |
| `applyCopy(payload, userId)` | orchestration | |

## How it works
1. Mount → `fetchCopyFromEventData(recordID)`: target values, series, target rooms, and events with the same title (for the search's initial list).
2. Pick a source → `fetchSourceEventDetails`: source values and rooms. Rooms default to all non-cancelled rows whose pair is not already on the target.
3. User checks fields (and Append), adjusts rooms, and picks a series scope when the target is in a series.
4. Footer **Copy to N events** → `applyCopyFromEvent`. Client refuses when nothing is selected or an append would exceed the field limit on the target.
5. Result table renders; the target is reloaded so "Current on target" values and "Already on target" badges reflect the write; field selections reset.

## Gotchas
- **Generated Zod schemas strip org-custom columns** — `models/EventRoomsSchema.ts` and `models/EventsSchema.ts` were generated from a domain without `Front_of_Room`, `Room_Occupied`, `Auditorium_Chairs`, `Round_Tables`, `Presenter_*`, `Power_Strips`, `Additional_Description`, `Registrant_Group`. Zod v4 `z.object()` drops unknown keys in `schema.parse()`, so those values would silently vanish. `EventRoomCreateSchema` is hand-written; the Events update passes no schema. See GOTCHA-044.
- **Series ≠ `Parent_Event_ID`** — do not derive occurrences from `Parent_Event_ID`; use the proc.
- **Dates are displayed as stored** — `formatMpDateTime` anchors the wall-clock parts to UTC and formats in UTC, so the browser zone never shifts them. Never use `new Date(mpString).toLocaleDateString()` here.
- **`escapeFilterString` is LIKE-only** — it rewrites `_` and `%` to bracket classes; the exact-title prefill uses plain `'` doubling instead.
- **IN lists are batched** — long id lists overflow MP's GET query-string limit (see the comment in `editRegistrationService.getAllInvoiceDetailsForEvent`).
- **New rooms are unapproved** — `_Approved` is read-only; copied rows enter the normal room-approval workflow. The result panel says so.
- **Cancelled target rows don't block a copy** — idempotency only considers non-cancelled rows on the target.
- **Text previews are plain text** — `FieldCopyRow` renders HTML-bearing fields as text in a scrolling box, never `dangerouslySetInnerHTML`.
- **v2 follow-up** — "make unique" cloning of Product / Form / Group (Copy Moore) is tracked in `.claude/TODO/2026-09-10-copy-from-event-make-unique-v2.md`.

## Related docs
- [`tool-framework.md`](tool-framework.md) — `ToolContainer` footer wiring
- [`../services/query-patterns.md`](../services/query-patterns.md) — FK traversal and column qualification
- [`../ministryplatform.datetimehandling.md`](../ministryplatform.datetimehandling.md) — why dates are formatted in UTC from wall-clock parts
- [`../granger/copy-moore/README.md`](../granger/copy-moore/README.md) — the SQL this tool's v2 will reproduce
