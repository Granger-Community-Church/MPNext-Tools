# Plan: Copy From Event tool

**Author:** jmoore@grangerchurch.com (drafted with Claude)
**Date:** 2026-09-10
**Status:** Draft, awaiting review
**Branch:** `feature/copy-from-event-tool`

## Purpose

Event staff frequently create a new event (or series) that mirrors a past one, then hand-copy descriptions, registration links, and the full Rooms & Groups list. This tool is launched from an open Event record in Ministry Platform, lets the user pick a prior "source" event, and copies chosen fields and related rows onto the **existing** target event. It never creates events.

Reference example: target event 97983 "Night of Worship" (2026-09-17) was created as a copy of source event 95394 (2026-03-24). The source has 36 `Event_Rooms` rows and 40 `Event_Groups` rows; the target has none of either.

## What we learned from the data

- The MP "Rooms & Groups" sub-page on Events is the `Event_Rooms` table (one row per Room + optional Group). There is no `Room_Reservations` table in this domain's API schema. The "Groups" sub-page is the separate `Event_Groups` table (Group + optional Room + Closed).
- On the source event both tables are populated and they do not agree with each other (for example `Event_Rooms` puts "Infants" in room 10 while `Event_Groups` puts the same group in room 11). The tool must copy each table literally and not try to reconcile them.
- `Event_Rooms` carries reservation detail (layout, chairs, tables, notes, `Room_Occupied`, `Auto_Close_At_Capacity`, `Balance_Priority`, `Checkin_Capacity`). These should all copy. `_Approved`, `_Tech_Approved`, `_Reservation_Start`, `_Reservation_End` are computed or read-only and must not be sent.
- `Events.Additional_Description` is `Text` (unbounded). `Description` is 2000 chars, `Meeting_Instructions` is 4000 chars. The MP API enforces these; the UI should show length so a copy does not fail late.
- Series membership is expressed by `Events.Parent_Event_ID`. Neither example event has children, so series behavior is designed from the schema, not observed data.
- Generated models and Zod schemas already exist: `Events`, `EventRooms`, `EventGroups`, plus `EventRoomsSchema` and `EventGroupsSchema` in `src/lib/providers/ministry-platform/models/`.

## User flow

1. **Launch** from an Event record: `/tools/copyfromevent?pageID=308&recordID=97983`. The target is fixed to `recordID`. If launched without a record the tool shows an empty state asking the user to open it from an event.
2. **Target header** shows the target event title, date, congregation, and whether it belongs to a series (parent plus child count).
3. **Pick a source event.** A search box filters `Events` by title (`LIKE`, single quotes escaped). Results are ordered by start date descending and exclude the target itself. On first load the list is pre-filtered to events with the same title as the target, which will usually surface the right one immediately. Each result shows title, date, congregation, and counts of rooms and groups so the user can tell a rich source from an empty one.
4. **Choose what to copy.** Three sections, each with its own toggles:
   - **Event fields** (one toggle per field): `Meeting_Instructions`, `Description`, `Additional_Description`, `Online_Registration_Product`, `Registration_Form`, `Registrant_Group`. Each row shows the source value and the current target value side by side (FK fields show the linked name, not the ID). Default on when the target is empty and the source has a value. Default off when the target already has a value, because the copy overwrites.
   - **Rooms & Groups** (`Event_Rooms`): a checklist of the source rows, all selected by default, showing Building / Room / Group / Layout / Notes. Rows whose Room + Group pair already exists on the target are shown but disabled with an "already on target" note so the copy is idempotent.
   - **Groups** (`Event_Groups`): same treatment, all selected by default. Kept as a separate section so the user can copy rooms without groups or vice versa.
5. **Series scope.** When the target has a `Parent_Event_ID`, or other events point to it as parent, show a checklist of every event in that series (parent plus children, by date). The target is checked by default and the rest are unchecked. Whatever is selected receives the same copy. Field copies and row copies both fan out.
6. **Review and apply.** A summary line states exactly what will happen ("Update 3 fields and add 36 rooms and 40 groups on 1 event"). The footer Save button applies it. Progress is shown per target event. On completion the tool shows a result list with any per-row failures rather than failing the whole batch.

## Data operations

All writes pass `$userId` so MP's audit log attributes the change to the signed-in user.

| Section | Read | Write |
|---|---|---|
| Event fields | `Events` select of the six fields plus `Online_Registration_Product_TABLE.Product_Name`, `Registration_Form_TABLE.Form_Title`, `Registrant_Group_TABLE.Group_Name` for both source and target | One `updateTableRecords('Events', [{ Event_ID, ...selectedFields }])` per target event, validated with `EventsSchema` (partial) |
| Rooms & Groups | `Event_Rooms` where `Event_ID = source`, with `Room_ID_TABLE.Room_Name`, `Room_ID_TABLE_Building_ID_TABLE.Building_Name`, `Group_ID_TABLE.Group_Name`, `Room_Layout_ID_TABLE.Room_Layout` | `createTableRecords('Event_Rooms', rows)` with `Event_ID` set to the target and `Event_Room_ID` plus computed columns stripped, validated with `EventRoomsSchema` |
| Groups | `Event_Groups` where `Event_ID = source`, with group and room names | `createTableRecords('Event_Groups', rows)` with `Event_ID` set to the target, validated with `EventGroupsSchema` |
| Series | `Events` where `Event_ID = parent OR Parent_Event_ID = parent` | none |

Duplicate protection: before creating rows, read the target's existing `Event_Rooms` and `Event_Groups` and skip any source row whose (`Room_ID`, `Group_ID`) or (`Group_ID`, `Room_ID`) pair already exists. Report skipped rows in the result.

`Cancelled` rows on the source are excluded from the checklist by default with a "show cancelled" toggle.

## Architecture

Follows the Edit Registration tool, the most recent tool in this repo.

```
src/app/(web)/tools/copyfromevent/
├── page.tsx                      # parseToolParams, default export (Next.js requirement)
└── copy-from-event.tsx           # "use client" shell: ToolContainer, state, save orchestration

src/components/copy-from-event/
├── index.ts                      # barrel
├── actions.ts                    # server actions (auth check → service)
├── source-event-search.tsx       # search box + results list
├── event-fields-section.tsx      # per-field toggles with side-by-side values
├── related-rows-section.tsx      # generic checklist used for Event_Rooms and Event_Groups
├── series-scope-section.tsx      # series member checklist
└── copy-summary.tsx              # "what will happen" line + result list

src/services/copyFromEventService.ts        # singleton wrapping MPHelper
src/services/copyFromEventService.test.ts
src/lib/dto/copy-from-event.dto.ts          # DTOs below, re-exported from src/lib/dto/index.ts
```

Add a homepage card in `src/app/(web)/page.tsx` per the `/newtool` convention. Route name `copyfromevent`, component `CopyFromEvent`, display name "Copy From Event".

### DTOs

- `CopyableEvent`: `Event_ID`, `Event_Title`, `Event_Start_Date`, `Event_End_Date`, `Congregation_Name`, `Parent_Event_ID`, the six copyable fields, and the three FK display names.
- `SourceEventSearchResult`: `CopyableEvent` plus `Room_Count` and `Group_Count`.
- `SourceEventRoom`: the `Event_Rooms` columns that copy, plus display names.
- `SourceEventGroup`: the `Event_Groups` columns that copy, plus display names.
- `SeriesMember`: `Event_ID`, `Event_Title`, `Event_Start_Date`, `Is_Parent`.
- `CopyFromEventPayload`: `sourceEventId`, `targetEventIds[]`, `fields: Partial<Pick<Events, six fields>>` (only selected keys present), `eventRoomIds[]`, `eventGroupIds[]`.
- `CopyFromEventResult`: per target event, fields updated, rooms created, groups created, rows skipped as duplicates, and errors.

### Service methods

- `getEvent(eventId)` and `searchEvents(term, excludeEventId, top)`.
- `getEventRooms(eventId)` and `getEventGroups(eventId)`.
- `getSeriesMembers(eventId)`: resolves the root parent, then returns root plus children.
- `updateEventFields(eventId, fields, userId)`.
- `copyEventRooms(sourceRows, targetEventId, userId)` and `copyEventGroups(sourceRows, targetEventId, userId)`, each doing the duplicate check and returning created versus skipped counts.

### Server actions

- `fetchTargetContext(eventId)`: target event, series members, existing rooms and groups on the target.
- `searchSourceEvents(term, excludeEventId)`.
- `fetchSourceDetails(eventId)`: source event, rooms, groups.
- `applyCopy(payload)`: iterates target events, calls service methods, collects `CopyFromEventResult`. Field updates run first, then rooms, then groups, so a row failure never blocks the field update.

## Copy Moore report: tabled for a later iteration

The Copy Moore report (`report_Event_Selected_Copy_Moore_granger`, Kevin McCord 2024-02-06) solves a different problem. It reads an event's Product, Registrant Group, and Form, reports whether each is **unique** to that event (no other event references it), and when asked, calls `util_CopyMoore_Granger` to clone the shared object so the event gets its own copy, optionally renamed via `@NewName`.

That is the natural second step after this tool. Copying the three FK fields from a source event deliberately creates the shared state that Copy Moore then unshares. A future iteration would add a "make unique" action beside each of those three fields: clone the Product (with option groups and prices), Form (with fields), or Group, then point the target event at the clone.

Why it is tabled rather than built now:

- The cloning logic lives in `util_CopyMoore_Granger`, whose body we could not retrieve. The local environment has no dev client credentials, so `api_dev_GetProcedureDefinition` cannot run. The RDL and report proc only wrap it.
- The report relies on MP selection plumbing (`dp_Selected_Records`, `@PageID`, `@SelectionID`) that the tool does not need because it acts on one record.
- Cloning a Product or Form correctly touches several child tables and deserves its own review.

To unblock it later: export the `util_CopyMoore_Granger` definition from SQL Server Management Studio into `src/lib/providers/ministry-platform/db/` alongside the report proc, or set `MINISTRY_PLATFORM_DEV_CLIENT_ID` and `MINISTRY_PLATFORM_DEV_CLIENT_SECRET` locally and fetch it through the API.

## Decisions taken in this draft (change if wrong)

1. **Both `Event_Rooms` and `Event_Groups` are in scope**, as separate sections. The request named "Rooms & Groups (Room_Reservations)", which is `Event_Rooms`, but the source event also relies on `Event_Groups` and check-in reads both. Dropping the Groups section is a one-file change.
2. **Field toggles default to on only when the target is empty.** Overwriting a value the staff already typed felt like the more expensive mistake.
3. **Series scope defaults to the launched event only.** Fan-out to the whole series is one click but is opt-in.
4. **Room availability conflicts are not checked in v1.** MP already flags double bookings in its own room reservation views. A warning could be added later by querying other events' `Event_Rooms` for the same room overlapping the target's start and end.
5. **No delete.** The tool only adds rows and updates the six fields. Cleaning up a wrong copy happens in MP.

## Implementation phases

Each phase ends with `npm run test:run`, `npm run lint`, and `npm run build` green, and a commit on this branch.

1. **Scaffold and read path.** DTOs, service read methods with tests, actions, route, tool shell, source search, target header. Verifiable on localhost with `?pageID=308&recordID=97983`.
2. **Selection UI.** Event fields section with side-by-side values, rooms and groups checklists with duplicate detection, series scope section, summary line.
3. **Write path.** Service write methods with tests covering duplicate skipping and validation failures, `applyCopy` action, per-target progress and result list.
4. **Polish.** Empty states, cancelled-row toggle, length indicators on text fields, homepage card, reference doc entry under `.claude/references/components/`, and a TODO file recording the Copy Moore follow-up.
5. **PR** back to `main` with a manual test log against 97983 ← 95394 on production data, executed with a throwaway target event rather than the live one.

## Out of scope

- Creating events or event series.
- Copying participants, invoices, equipment, services, or metrics.
- Cloning Products, Forms, or Groups (Copy Moore follow-up).
- Room availability checking.
