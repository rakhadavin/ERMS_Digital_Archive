# Core Feature — Retention Notification Automation

## Purpose

Retention Notification Automation is the second core feature.

It helps administrators identify documents whose retention period will expire within the next 6 months.

The feature supports digital archive preservation by ensuring documents are reviewed before expiration.

## Main Rule

The system must identify documents where retention expires within 6 months from the current date.

In the current database concept, retention is stored as `tahun_retensi`.

Rule:

```txt
document is expiring soon if retention deadline is within 6 months
```

If only `tahun_retensi` is available, approximate using year-based logic. Prefer adding a full `retention_deadline` date in the implementation for better accuracy.

## Recommended Data Improvement

Instead of only storing `tahun_retensi`, also store:

```txt
retention_deadline
```

This allows more precise 6-month calculation.

Recommended formula:

```txt
retention_deadline = tanggal_dokumen + retention years
```

## Scheduler

The notification check runs every 14 days.

Recommended scheduler options:

- Cron job
- Backend scheduler
- Serverless scheduled function
- Celery Beat if using Python backend

## Notification Recipient

The notification is sent or shown to admin.

Delivery options:

1. In-app notification
2. Email notification
3. Both

If email is not implemented yet, build in-app notification first.

## Notification Content

Each notification item should show:

- Document title
- `nomor_dokumen`
- `unit_pengolah`
- Main category
- Sub-category
- `tahun_retensi`
- Retention deadline if available
- Link to document detail page

## Notification Page

Route:

```txt
/notifications
```

Purpose:

Display documents that will expire within the next 6 months.

Components:

- Summary count
- Expiring document list
- Link to document detail
- Shortcut to filtered document list

## Redirect to List of Documents

When the user clicks the notification link, redirect to:

```txt
/documents?masa_retensi=6-months
```

or:

```txt
/documents?retention=6-months
```

The Documents page should automatically apply the 6-month retention filter.

## Retention Action Buttons

In document detail, show these buttons only when retention is within 6 months:

1. `Pertahankan`
2. `Musnahkan`

## Pertahankan Behavior

When admin clicks `Pertahankan`:

1. Show confirmation dialog.
2. Update document status to `PERMANENT_RETAINED` or `PERTAHANKAN`.
3. Save action timestamp.
4. Save actor/admin identity if available.
5. Keep the document file.

Recommended status:

```txt
PERMANENT_RETAINED
```

## Musnahkan Behavior

When admin clicks `Musnahkan`:

1. Show confirmation dialog.
2. Update document status to `MARKED_FOR_DESTRUCTION` or `MUSNAHKAN`.
3. Save action timestamp.
4. Save actor/admin identity if available.
5. Do not hard-delete the document immediately.

Recommended status:

```txt
MARKED_FOR_DESTRUCTION
```

## Business Rules

1. Retention notification runs every 14 days.
2. Notification targets documents expiring within 6 months.
3. Documents already marked as `PERMANENT_RETAINED` should not appear again.
4. Documents already marked as `MARKED_FOR_DESTRUCTION` should not appear again unless needed for audit view.
5. Retention action buttons only appear in document detail when the document is expiring soon.
6. Destruction must be auditable.

## Suggested Status Values

```ts
export type DocumentStatus =
  | "ACTIVE"
  | "EXPIRING_SOON"
  | "EXPIRED"
  | "PERMANENT_RETAINED"
  | "MARKED_FOR_DESTRUCTION";
```

## Suggested Utility

```ts
import { addMonths, addYears, isBefore, isAfter } from "date-fns";

export function calculateRetentionDeadline(
  tanggalDokumen: Date,
  retentionYears: number
): Date {
  return addYears(tanggalDokumen, retentionYears);
}

export function isRetentionWithinSixMonths(retentionDeadline: Date): boolean {
  const today = new Date();
  const sixMonthsFromNow = addMonths(today, 6);

  return isAfter(retentionDeadline, today) && isBefore(retentionDeadline, sixMonthsFromNow);
}
```

## Minimum Viable Version

1. Calculate retention year.
2. Query documents expiring within 6 months.
3. Display notification list.
4. Redirect to filtered document list.
5. Show `Musnahkan` and `Pertahankan` buttons conditionally.
6. Save selected action as document status.
