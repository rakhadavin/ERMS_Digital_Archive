# Supporting Feature — List of Documents and Search

## Purpose

The List of Documents page displays all stored documents.

It also acts as the result page for:

- Homepage search
- Retention notification redirect
- Category related document search

## Route

```txt
/documents
```

## Default View

Display all documents in a table or card list.

Recommended columns:

- Title
- `nomor_dokumen`
- `unit_pengolah`
- `tanggal_dokumen`
- Main category
- Sub-category
- `tahun_retensi`
- `sifat_dokumen`
- Status
- Action

## Search Behavior

Default search uses main category.

Example:

```txt
User searches: Finance
System searches in: name_MC
```

## Advanced Search

Use radio buttons to activate advanced search.

Fields:

1. `title`
2. `description`
3. `tentang`
4. `konteks`

Only one radio button can be active at a time.

If no advanced field is selected, use main category search.

## Filters

Available filters:

| Filter | Description |
|---|---|
| Tahun | Filter by year from `tanggal_dokumen`. |
| Jenis Arsip | Filter by `sifat_dokumen`. |
| Masa Retensi | Filter by retention period. |
| Main Category | Filter by `code_MC`. |
| Sub-Category | Filter by `code_SC`. |
| Status | Filter by document status. |

## Query Parameters

The page should support query parameters.

Examples:

```txt
/documents?search=finance
/documents?search=annual-report&field=title
/documents?tahun=2024
/documents?sifat_dokumen=Rahasia
/documents?retention=6-months
/documents?code_MC=KU
/documents?code_SC=KU.01
```

## Retention Notification Redirect

When the user clicks a notification link, redirect to:

```txt
/documents?retention=6-months
```

This should automatically activate the 6-month retention filter.

## Document Detail

Route:

```txt
/documents/[id]
```

The detail page should display:

- Title
- Description
- Tentang
- Konteks
- Unit pengolah
- Nomor dokumen
- Tanggal dokumen
- Tahun retensi
- Sifat dokumen
- Main category
- Sub-category
- File path / preview
- File type
- Created date
- Document status

## Document Detail Actions

Standard actions:

1. Read / Preview
2. Download
3. Edit metadata
4. Delete

Conditional retention actions:

1. Musnahkan
2. Pertahankan

The conditional actions only appear if retention is within 6 months of expiry.

## File Preview Behavior

Minimum behavior:

- PDF: show preview if possible.
- Image: show image preview.
- Other files: show file information and download button.

## Minimum Viable Version

1. Show document table.
2. Add default search by main category.
3. Add advanced search radio buttons.
4. Add basic filters.
5. Add document detail page.
6. Add download and preview buttons.
7. Add conditional retention action buttons.
