---
title: Copy Moore report (reference only)
type: reference
domain: granger
---

Granger-specific SQL kept for reference. **Not deployed by this repo** (the `db/` folder is compiled into the MP install script; this folder is not).

## What it is
An "actionable report" built by Kevin McCord (2024-02-06) that runs from an Events selection in MP.

| File | Role |
|---|---|
| `report_Event_Selected_Copy_Moore_granger.sql` | Report proc. Takes the selected events, reports whether each event's Product / Registrant Group / Form is **unique** to that event (no other event references it), and, when `@EventID` plus `@CopyProduct`/`@CopyGroup`/`@CopyForm` are set, calls the util below first. |
| `util_CopyMoore_Granger.sql` | Does the cloning. For a shared object it inserts a copy (Product + Option Groups + Option Prices; Group; Form + Form Fields), names it `@NewName` (default `Event_Title + ' ' + start date`, 50 chars), repoints the event's FK at the clone, and writes `dp_Audit_Log` rows via `util_createauditlogentries`. For Groups it also repoints `Event_Rooms.Group_ID` and `Event_Groups.Group_ID` on that event. |

The RDL (`Copy Moore RDL` on the desktop) is a thin SSRS wrapper: parameters `EventID`, `CopyProduct`, `CopyGroup`, `CopyForm`, `NewName`, a table of the `#CopyMoore` columns, and the note "Can only copy an item if it is NOT unique to the event."

## Why it is here
The **Copy From Event** tool (`src/components/copy-from-event/`) deliberately creates the shared state this report unshares: it copies `Online_Registration_Product`, `Registration_Form`, and `Registrant_Group` from a source event onto a target event. A v2 "make unique" action beside each of those fields would reproduce this util's behaviour. See `.claude/TODO/2026-09-10-copy-from-event-make-unique-v2.md`.

## Notes for a TypeScript port
- The util runs as `@AuditUserID = 0` / `'CopyMooreActionableReport'`; a tool port should pass the real `$userId` instead.
- `Form_GUID` is intentionally not copied (MP generates it).
- Cloned Groups get `Start_Date = GETDATE()`, `End_Date = NULL`.
- The "unique" check is a plain `EXISTS` across all Events, cancelled or not.
