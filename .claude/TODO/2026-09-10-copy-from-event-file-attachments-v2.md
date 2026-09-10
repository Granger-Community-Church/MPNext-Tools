---
title: Copy From Event v2 — copy file attachments from the source event
severity: low
tags: [refactor]
area: components
files:
  - src/components/copy-from-event/actions.ts
  - src/services/copyFromEventService.ts
  - src/lib/providers/ministry-platform/helper.ts
discovered: 2026-09-10
discovered_by: copy-from-event-manual-test
status: open
---

## Problem
Events carry file attachments (the Files sub-page, `dp_Files` with `Table_Name = 'Events'` and `Record_ID = Event_ID`): flyers, run sheets, room diagrams. Staff who copy an event's descriptions and rooms with the Copy From Event tool still have to re-upload those files by hand on the new event. Raised during the first manual test of the tool on 2026-09-10.

## Evidence
- The tool's scope is `Events` fields plus `Event_Rooms` only (`src/lib/dto/copy-from-event.dto.ts`, `COPYABLE_FIELDS` / `EVENT_ROOM_COPY_COLUMNS`).
- `MPHelper` already exposes the files API (`getFiles`, `uploadFile`, `getFileContent`-style methods in `src/lib/providers/ministry-platform/helper.ts`; see `FileDescription`, `FileUploadParams` in `types/provider.types.ts`), so no new provider surface is needed.

## Proposed fix
1. Service: `getEventFiles(eventId)` listing `dp_Files` for the event (name, size, `Default_Image`, description), and `copyEventFiles(sourceEventId, targetEventId, fileIds, userId)` that downloads each selected file's bytes and re-uploads it to the target with the same description and default-image flag, passing `$userId`.
2. UI: a third checklist section "Files" in the same shape as `RoomCopySection` (all selected by default, size shown, "already on target" by file name).
3. Apply: a third per-occurrence step after rooms, isolated with its own `fileError`, and `filesCopied` in `OccurrenceCopyResult` / summary.
4. Series fan-out uploads once per occurrence; watch total payload size for large series.

## Impact if not fixed
Half of the "set up the new event" chore remains manual for events that rely on attachments. Low severity: the workaround is a normal MP upload.
