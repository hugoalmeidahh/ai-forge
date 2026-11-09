---
name: ai-forge-integrations-scheduled-jobs
description: "Specify or configure authorized recurring jobs and reminders using a real scheduler, explicit timezone, deduplication, recovery and observed execution state."
---

# Scheduled jobs

Discover the available scheduler before promising automation. A saved specification or generated cron expression is not an installed/enabled job. A scheduled API call does not expand the executor's permissions.

## Contract

Record action, owner, target, date/frequency, IANA timezone, start/end or execution limit, success/failure definition and notification destination when requested. Distinguish a reminder, deterministic command and agent run: they have different costs/effects.

Define overlap handling, missed-run behavior, restart persistence, timeout, retry bound and idempotency/deduplication key. Confirm business-day/DST expectations when relevant; a server's timezone is not automatically the user's.

## Install and verify

1. Inspect existing schedules and returned IDs to avoid duplicates. Use the project's scheduler or exposed connector; do not modify global cron/system configuration for an unrelated reminder.
2. Prepare the concrete job/configuration and validate syntax/target. Persist credentials through supported secret mechanisms, not in a public command or schedule body.
3. Install/enable only within the authorized request and available role. Reconcile uncertain timeout results before creating another job.
4. Read back the installed job, timezone and next trigger. A configuration readback proves scheduling, not successful task execution. Test real effects only when authorized.
5. For pause/edit/removal, identify the actual job and preserve unrelated settings. Report executor, ID, timing, next observed trigger, state and how to pause/remove it.

If no executor exists, deliver the specification and explicitly report not scheduled. Do not invent runtime scheduler commands or an active reminder.
