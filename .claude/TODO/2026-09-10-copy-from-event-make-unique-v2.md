---
title: Copy From Event v2 — "make unique" clone of shared Product / Form / Registrant Group
severity: low
tags: [refactor]
area: components
files:
  - src/components/copy-from-event/actions.ts
  - src/services/copyFromEventService.ts
  - .claude/references/granger/copy-moore/util_CopyMoore_Granger.sql
discovered: 2026-09-10
discovered_by: copy-from-event-planning
status: open
---

## Problem
The Copy From Event tool copies `Online_Registration_Product`, `Registration_Form`, and `Registrant_Group` by **pointing the target event at the same records** the source uses. That is often fine, but for registration-driven events staff usually want the target to own its **own** Product / Form / Group so edits and registrations don't bleed between events. Today that is handled by the Granger "Copy Moore" actionable report (`report_Event_Selected_Copy_Moore_granger` → `util_CopyMoore_Granger`), which clones the shared object and repoints the event.

## Evidence
- `.claude/references/granger/copy-moore/README.md` — what the report and util do.
- `.claude/references/granger/copy-moore/util_CopyMoore_Granger.sql` — full clone logic (Product + Option Groups + Option Prices; Group; Form + Form Fields), audit rows via `util_createauditlogentries`.
- Copy From Event v1 plan explicitly tabled this ("Table it for v2", decided 2026-09-10).

## Proposed fix
Add a "Make unique" action beside each of the three FK rows in `field-copy-row.tsx` (shown when the target's current value is shared with at least one other event), backed by either:

1. **Port to TypeScript** in `copyFromEventService.ts`: read the shared object and its children via `getTableRecords`, `createTableRecords` the clones with `$userId`, then `updateTableRecords('Events', ...)` to repoint. Also repoint `Event_Rooms.Group_ID` on the target when cloning the Group (the util does this). Prefer this: it keeps audit attribution on the real user and needs no SQL deploy.
2. **Wrap the util** with a new `api_MPNextTools_CopyMooreMakeUnique` proc in `src/lib/providers/ministry-platform/db/` that accepts `@UserID` for audit and calls the util. Requires the util to exist in every deploying domain.

Either way, add a "unique / shared with N events" indicator to the three FK rows first (one grouped count query per FK) so staff can see when cloning matters.

## Impact if not fixed
Staff keep using the SSRS report for the second half of the workflow, so the tool only removes half the manual steps for registration events.
