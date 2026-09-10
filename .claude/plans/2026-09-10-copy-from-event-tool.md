# Plan: Copy From Event tool

**Author:** jmoore@grangerchurch.com (drafted with Claude)
**Date:** 2026-09-10 (revised same day after review)
**Status:** Built; manual test passed on throwaway event 98575 (2026-09-10); PR open
**Branch:** `feature/copy-from-event-tool`

## Context

Event staff create a new event (or series) that mirrors a past one, then hand-copy descriptions, registration links, and the whole Rooms & Groups list. This tool is launched from an open Event record in Ministry Platform, lets the user pick a prior "source" event, and copies chosen fields and `Event_Rooms` rows onto the **existing** target event(s). It never creates events.

Reference example: target 97983 "Night of Worship" (2026-09-17) was created from source 95394 (2026-03-24). Source has 36 `Event_Rooms` rows; target has none.

### Decisions confirmed with the user
- **Scope of copy**: six `Events` fields + `Event_Rooms` rows. `Event_Groups` is deprecated here and is **out of scope**.
- **Field toggles**: all default **off** (MP Mass Assign precedent). Checking a field = overwrite. The three long-text fields get a second, indented **Append** checkbox (disabled until the field is checked). When a field is checked without Append and the target already has a value, show an amber overwrite cue.
- **Source search**: any event, type-ahead on title, results show congregation + start date, most recent first. First load pre-fills results with events sharing the target's exact title.
- **Series**: driven by `dp_Sequences`, not `Parent_Event_ID`. Use core proc `api_Common_GetEventsInSeries(@EventID)` (verified: returns full Event rows for all occurrences, empty for standalone). Scope radio: **Just this event** (default) / **This and all future occurrences** (start date >= target's start date) / **All occurrences**.
- **Copy Moore** ("make unique" cloning of Product/Form/Group via `util_CopyMoore_Granger`): **tabled for v2**. Store both SQL files under `.claude/references/granger/` plus a TODO entry.
- **UI style**: model on Edit Registration (sectioned cards, footer save).
- **File attachments**: not copied in v1; tracked in `.claude/TODO/2026-09-10-copy-from-event-file-attachments-v2.md` (raised during the manual test).
- **Copy Moore "make unique"**: v2, `.claude/TODO/2026-09-10-copy-from-event-make-unique-v2.md`.

### Key findings that shape the code
- Generated models are **stale vs this org's schema**: `models/EventRooms.ts` lacks `Front_of_Room`, `Auditorium_Chairs`, `Round_Tables`, `Presenter_Tables`, `Presenter_Chairs`, `Power_Strips`, `Room_Occupied`; `models/Events.ts` lacks `Additional_Description` and `Registrant_Group`. `MPHelper.createTableRecords` runs `schema.parse()` (`helper.ts:212`) and Zod v4 strips unknown keys, and `EventRoomsSchema` requires `Event_Room_ID`. So: use a **hand-written `EventRoomCreateSchema`** for room creates and **no schema** on the Events update. Do not regenerate models on this branch (large unrelated diff; sandbox/prod drift noted in memory).
- `Room_Layouts.Layout_Name` is the layout display column. Building name is a two-hop traversal `Room_ID_TABLE_Building_ID_TABLE.Building_Name`.
- `_Approved`, `_Tech_Approved`, `_Reservation_Start`, `_Reservation_End` on `Event_Rooms` are read-only/computed; never send them. New rooms will land unapproved in MP's approval workflow — surface that in results.
- Text fields hold HTML in practice (`<b>`, `<br>`). Lengths: `Meeting_Instructions` 4000, `Description` 2000, `Additional_Description` unbounded.

## Files

### New
| File | Responsibility |
|---|---|
| `src/app/(web)/tools/copyfromevent/page.tsx` | `Promise.all([parseToolParams(await searchParams), getMpTimezone()])` like `tools/groupwizard/page.tsx:10-15`; renders `<CopyFromEvent params mpTimezone />`; `generateMetadata` title "Copy From Event". |
| `src/app/(web)/tools/copyfromevent/copy-from-event.tsx` | `'use client'` shell: owns state, loads target via `useEffect` + action (pattern `tools/eventcheckin/event-checkin.tsx:47-67`), missing-recordID screen (`event-checkin.tsx:144-152`), `ToolContainer` footer save (`tools/fieldmanagement/field-management.tsx:84-125`), `sonner` toasts. |
| `src/components/copy-from-event/index.ts` | Barrel. |
| `src/components/copy-from-event/actions.ts` + `actions.test.ts` | Server actions (below). `getSession()` guard as in `edit-registration/actions.ts:19-23`. |
| `src/components/copy-from-event/source-event-search.tsx` | Popover + Command type-ahead, 300 ms debounce, min 2 chars — clone `group-wizard/group-search.tsx:31-155`. Lists `initialResults` (same-title prefill) when query < 2 chars. Row: title / congregation / date / room-count badge. |
| `src/components/copy-from-event/field-copy-section.tsx` + `field-copy-row.tsx` | Six Mass-Assign-style rows: enable checkbox left of label; indented Append checkbox for text fields; 2-column "Source / Current target" grid (`edit-registration/move-event-section.tsx:270-283`); amber callout on overwrite of non-null (`move-event-section.tsx:246-251`). Text shown as text in `max-h-40 overflow-auto whitespace-pre-wrap` (never `dangerouslySetInnerHTML`). FK rows show linked name with ID muted. Live `n / max` counter for bounded fields when Append is on. |
| `src/components/copy-from-event/room-copy-section.tsx` | Checklist table, indeterminate select-all, `Set<number>` — clone `event-checkin/participant-list.tsx:39-160`. Columns: Building, Room, Group, Layout, Notes. "Show cancelled" toggle. Rows whose pair already exists on the target get an "Already on target" badge and are unchecked by default. |
| `src/components/copy-from-event/series-scope-section.tsx` | `RadioGroup` with the three scopes and computed counts; rendered only when the target is in a series. |
| `src/components/copy-from-event/copy-result-summary.tsx` | Per-occurrence result table (date, fields updated, rooms created, rooms skipped, error) with green/amber/red tint; note "created rooms are pending approval". |
| `src/services/copyFromEventService.ts` + `.test.ts` | Singleton wrapping `MPHelper` (shape of `editRegistrationService.ts:29-42`). Queries, pure merge helpers, apply orchestration. |
| `src/lib/dto/copy-from-event.dto.ts` | DTOs, `COPYABLE_FIELDS`, `EVENT_ROOM_COPY_COLUMNS`, `EventRoomCreateSchema`. |
| `.claude/references/granger/copy-moore/report_Event_Selected_Copy_Moore_granger.sql`, `util_CopyMoore_Granger.sql`, `README.md` | Reference-only copies of the Desktop SQL (util body pasted in chat) + short note on what they do. |
| `.claude/TODO/2026-09-10-copy-from-event-make-unique-v2.md` | v2 follow-up per `.claude/TODO/SCHEMA.md`. |
| `.claude/references/components/copy-from-event.md` | Reference doc in the shape of `field-management.md`. |

### Modified
- `src/lib/dto/index.ts` — re-export the new DTOs/consts.
- `src/app/(web)/page.tsx` — homepage Card after Add/Edit Family (lines 111-123).
- `.claude/references/components/README.md` — file-map + code-surfaces rows.
- `CLAUDE.md` — Component Organization line for `copy-from-event/`.
- `.claude/plans/2026-09-10-copy-from-event-tool.md` — rewrite to match this plan.

## DTOs (`copy-from-event.dto.ts`)
```ts
type CopyableTextField = 'Meeting_Instructions' | 'Description' | 'Additional_Description';
type CopyableFkField   = 'Online_Registration_Product' | 'Registration_Form' | 'Registrant_Group';
type CopyableField = CopyableTextField | CopyableFkField;
const COPYABLE_FIELDS: { key; label; kind: 'text'|'fk'; maxLength?; nameKey? }[]  // 4000 / 2000 / none
interface EventFieldValues { Event_ID; Event_Title; Event_Start_Date; Congregation_Name; the six fields; Product_Name; Form_Title; Group_Name }
interface SourceEventSearchResult { Event_ID; Event_Title; Event_Start_Date; Congregation_Name; Room_Count? }
interface SeriesOccurrence { Event_ID; Event_Title; Event_Start_Date }
type SeriesScope = 'this' | 'future' | 'all';
interface EventRoomRow { Event_Room_ID; Event_ID; Room_ID; Room_Name; Building_Name; Group_ID; Group_Name; Room_Layout_ID; Layout_Name; + all EVENT_ROOM_COPY_COLUMNS; Cancelled }
const EVENT_ROOM_COPY_COLUMNS = ['Room_ID','Group_ID','Default_Group_Room','Balance_Priority','Closed','Auto_Close_At_Capacity','Room_Layout_ID','Front_of_Room','Chairs','Auditorium_Chairs','Round_Tables','Tables','Presenter_Tables','Presenter_Chairs','Power_Strips','Room_Occupied','Notes','Checkin_Capacity'] as const;
const EventRoomCreateSchema = z.object({ Event_ID, ...copy columns (nullable where MP allows), Cancelled: z.literal(false) });
interface FieldSelection { enabled: boolean; append: boolean }   type FieldSelectionMap = Record<CopyableField, FieldSelection>;
interface ApplyCopyPayload { targetEventId; sourceEventId; scope: SeriesScope; fields: Partial<Record<CopyableField, { mode: 'overwrite'|'append' }>>; sourceEventRoomIds: number[] }
interface OccurrenceCopyResult { Event_ID; Event_Start_Date; fieldsUpdated: CopyableField[]; roomsCreated; roomsSkipped; fieldError?; roomError? }
interface ApplyCopyResult { success: true; occurrences: OccurrenceCopyResult[]; summary: { occurrenceCount; fieldsUpdated; roomsCreated; roomsSkipped; failed } }
```

## Service (`copyFromEventService.ts`)
Every base column is qualified because every query joins tables with colliding names (CLAUDE.md item 10).

- `EVENT_FIELDS_SELECT`: `Events.Event_ID, Events.Event_Title, Events.Event_Start_Date, Congregation_ID_TABLE.Congregation_Name, Events.Meeting_Instructions, Events.Description, Events.Additional_Description, Events.Online_Registration_Product, Online_Registration_Product_TABLE.Product_Name, Events.Registration_Form, Registration_Form_TABLE.Form_Title, Events.Registrant_Group, Registrant_Group_TABLE.Group_Name`
- `EVENT_ROOM_SELECT`: `Event_Rooms.Event_Room_ID, Event_Rooms.Event_ID, Event_Rooms.Room_ID, Room_ID_TABLE.Room_Name, Room_ID_TABLE_Building_ID_TABLE.Building_Name, Event_Rooms.Group_ID, Group_ID_TABLE.Group_Name, Event_Rooms.Room_Layout_ID, Room_Layout_ID_TABLE.Layout_Name, Event_Rooms.<each copy column>, Event_Rooms.Cancelled`

| Method | Query / behavior |
|---|---|
| `getEventFieldValues(id)` | `Events`, `EVENT_FIELDS_SELECT`, `Events.Event_ID = ${id}`, top 1 |
| `getEventFieldValuesForIds(ids)` | same, `Events.Event_ID IN (...)`, batched at 100 IDs |
| `getSeriesOccurrences(id)` | `mp.executeProcedure('api_Common_GetEventsInSeries', { '@EventID': id })` → `result[0] ?? []` mapped to `SeriesOccurrence`, sorted by start asc; `[]` for standalone |
| `resolveOccurrences(target, scope)` | `'this'` → `[target]`; `'future'` → occurrences with start >= target start (compare via `DomainTimezoneService.parseMpDatetime`); `'all'` → all. Always includes target, deduped |
| `searchEvents({ term?, exactTitle?, excludeEventId, top=25 })` | `Events`, select `Events.Event_ID, Events.Event_Title, Events.Event_Start_Date, Congregation_ID_TABLE.Congregation_Name`; term → `Events.Event_Title LIKE '%${escapeFilterString(term)}%'` (`src/lib/validation.ts:38`); exactTitle → `Events.Event_Title = '${title.replace(/'/g,"''")}'` (plain quote doubling; `escapeFilterString` is LIKE-only); `AND Events.Event_ID <> ${excludeEventId}`; orderBy `Events.Event_Start_Date DESC` |
| `getRoomCounts(ids)` | `Event_Rooms`, `Event_ID, COUNT(Event_Room_ID) AS Room_Count`, `Event_ID IN (...) AND Cancelled = 0`, groupBy `Event_ID`; try/catch → empty Map |
| `getEventRooms(id, { includeCancelled })` | `EVENT_ROOM_SELECT`, `Event_Rooms.Event_ID = ${id}` (+ `AND Event_Rooms.Cancelled = 0`), orderBy building, room |
| `getExistingRoomPairs(ids)` | `Event_ID, Room_ID, Group_ID` where `Event_ID IN (...) AND Cancelled = 0`, batched; keys `${Event_ID}:${Room_ID}:${Group_ID ?? 'null'}` |
| `updateEventFields(id, patch, userId)` | `updateTableRecords('Events', [{ Event_ID, ...patch }], { $userId })`, no schema |
| `createEventRooms(records, userId)` | `createTableRecords('Event_Rooms', records, { schema: EventRoomCreateSchema, $userId })` |
| `applyCopy(payload, userId)` | orchestration below |

Exported pure helpers (unit-tested): `looksLikeHtml`, `mergeText(existing, source, mode)`, `pairKey`, `toRoomCreate(row, eventId)`.
**Append separator**: `<br><br>` if either side looks like HTML (`/<\/?[a-z][^>]*>/i`), else `\n\n`. Empty existing → plain overwrite; empty source with append → skip field.

### Apply algorithm
1. Load target and source via `getEventFieldValues`; throw if missing or equal.
2. `occurrences = resolveOccurrences(target, payload.scope)` — server re-resolves; never trusts a client ID list.
3. `sourceRooms = getEventRooms(source, { includeCancelled: true })` filtered to `payload.sourceEventRoomIds` (validates rows belong to source), deduped by (Room_ID, Group_ID).
4. If fields selected: `currentByEventId` from `getEventFieldValuesForIds`. If rooms selected: `existingPairs = getExistingRoomPairs(ids)`.
5. For each occurrence **sequentially** (ascending date):
   - **Fields** (try/catch → `fieldError`): per enabled field compute new value (append via `mergeText`; FK = source value); throw if over `maxLength`; only include changed values in the patch; one `updateEventFields` call.
   - **Rooms** (try/catch → `roomError`): skip pairs in `existingPairs` (count as skipped), else `toRoomCreate` and add pair; one `createEventRooms` call.
6. Return `ApplyCopyResult` with summary; client toasts error if `summary.failed > 0` else success, renders `CopyResultSummary`, reloads target so "current value" updates.

## Server actions (`actions.ts`)
- `fetchCopyFromEventData(targetEventId)` → `{ target, series, targetRooms, sameTitleEvents }` (parallel reads, then same-title search + room counts).
- `searchSourceEvents(term, excludeEventId)` → `SourceEventSearchResult[]` with room counts.
- `fetchSourceEventDetails(sourceEventId)` → `{ source, rooms }` (rooms include cancelled; client filters).
- `applyCopyFromEvent(payload)` → `ApplyCopyResult | { success: false; error }`; `$userId` via `getCurrentUserIdFromSession(session)` (never `session.user.id`).

## Client state (`copy-from-event.tsx`)
`target`, `series`, `targetRooms`, `sameTitleEvents`, `source`, `sourceRooms`, `fieldSelections` (all off), `selectedRoomIds`, `showCancelledRooms`, `scope='this'`, `isLoading`, `isLoadingSource`, `isSaving`, `error`, `result`. Derived: `occurrencesInScope`, `hasAnythingSelected`, `saveLabel = "Copy to N event(s)"`, `hideFooter = !source`. Selecting a source loads details and pre-selects all non-cancelled rooms not already on the target. Dates displayed with `Intl.DateTimeFormat(..., { timeZone: mpTimezone })`.

## Phases (each ends with `npm run test:run && npm run lint && npm run build`, then a commit)
0. **Housekeeping**: rewrite `.claude/plans/2026-09-10-copy-from-event-tool.md` to this plan; add `.claude/references/granger/copy-moore/` SQL + README; add the v2 TODO file and index row.
1. **DTOs + service + tests**: `copy-from-event.dto.ts`, `dto/index.ts`, `copyFromEventService.ts` + `.test.ts`. First confirm `Front_of_Room` (string) and `Room_Occupied` (boolean) types against live rows (already observed in this session: `Front_of_Room` null, `Room_Occupied` true).
2. **Actions + read-only UI**: `actions.ts` + tests, route, shell, search, field section, room section, series section, barrel, homepage card. Footer hidden; nothing writes.
3. **Apply flow**: `onSave` → `applyCopyFromEvent`, result summary, toasts, reload, disabled states.
4. **Docs**: components reference doc + README rows, CLAUDE.md line, GOTCHAS entry "generated Zod schemas strip org-custom columns".
5. **PR** to `main` after manual verification.

## Tests
- Service: `getSeriesOccurrences` (proc args, empty result, sort); `resolveOccurrences` (this/future/all, standalone); `searchEvents` (escaping `O'`, `%`, `_`; exclude; order; exactTitle uses `=`); `getRoomCounts` (groupBy, swallow errors); `getExistingRoomPairs` (batching >100, null group key); `mergeText` (overwrite/append plain/HTML/null cases); `toRoomCreate` (exact columns, no `Event_Room_ID`/`_Approved`); `applyCopy` (single overwrite → one update; unchanged → no call; append over 2000 → fieldError but rooms still created; duplicate skip + count; schema passed; three occurrences with middle failure isolated; foreign room IDs ignored; source==target throws).
- Actions: unauthorized throws; `fetchCopyFromEventData` composition; `applyCopyFromEvent` resolves userId and wraps service errors. Mock scaffold as in `field-management/actions.test.ts`.

## Manual verification (use a throwaway target event, never live 97983; source 95394)
1. Launch `/tools/copyfromevent?pageID=308&recordID=<scratch>`: header shows title/date in MP timezone; same-title prefill list.
2. Launch without `recordID` → "must be launched from an Event record".
3. Search a title fragment → congregation, date, room count shown; `O'` does not error.
4. Select source: six rows show source vs target; FK names; all off; footer hidden until something selected.
5. Check Description without Append on non-empty target → amber; check Append → cue clears; counter shows `n / 2000`.
6. Rooms: cancelled hidden until toggle; non-duplicates checked; header indeterminate after unchecking one.
7. Apply fields → MP record updated; `dp_Audit_Log` attributes to the signed-in user.
8. Apply rooms → Rooms & Groups subpage shows new rows, unapproved; re-apply → all skipped, zero created.
9. Scratch series target: "future" count correct; apply → only future occurrences changed; "all" changes earlier ones.
10. Append twice → separator appears once per apply.
11. Delete scratch data.

## Risks
- Stale generated schemas (handled by hand-written schema / no schema on update).
- IN-list query-string length → batch at 100 (see comment in `editRegistrationService.getAllInvoiceDetailsForEvent`).
- Append can exceed field limits → fail that field for that occurrence with a clear message; live counter in UI.
- HTML in text fields → render as text; separator decision above.
- New rooms are unapproved → say so in results and docs.
- Cancelled target rows do not block a copy of the same pair (intended).
- `groupBy` aggregate query is new in this repo → errors swallowed in `getRoomCounts`.
