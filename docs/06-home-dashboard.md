# Supporting Feature — Home Dashboard

## Purpose

The Home Dashboard is the landing page of the system.

It provides:

- Quick system overview
- Main search entry
- Quick access to core features
- Admin retention notification badge

## Route

```txt
/
```

## Main Components

1. Hero section
2. Search bar
3. Quick stats
4. Recent uploads
5. Retention alert badge
6. Quick navigation cards

## Search Bar

The homepage search bar should search by main category by default.

After user submits a search, redirect to:

```txt
/documents?search={keyword}
```

The Documents page will handle the search.

## Quick Stats

Recommended stats:

1. Total documents
2. Documents expiring soon
3. Total main categories
4. Total sub-categories

## Recent Uploads

Show latest uploaded documents.

Fields:

- Title
- Nomor dokumen
- Upload date
- Status

## Retention Alert Badge

For admin, show count of documents expiring within 6 months.

Clicking the badge should redirect to:

```txt
/notifications
```

or:

```txt
/documents?retention=6-months
```

## Quick Navigation Cards

Recommended cards:

1. Upload Document
2. Browse Documents
3. Manage Categories
4. Retention Notifications

## Minimum Viable Version

1. Search bar.
2. Quick navigation cards.
3. Basic stats.
4. Recent uploads.
5. Retention alert count.
