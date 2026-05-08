# CLAUDE.md — Digital Archive Metadata System

## Project Summary

This project is a web-based Digital Archive Metadata System for standard metadata, interoperability, and digital archive preservation.

The core problem is inconsistent document classification, which makes archive retrieval difficult. The system solves this by restructuring metadata, standardizing classification vocabularies, extracting metadata automatically, and supporting retention-based preservation workflows.

## Development Priority

Prioritize implementation in this order:

1. Database schema and core models
2. Auto-Metadata Extraction
3. Retention Notification Automation
4. Standard Category Vocabularies
5. List of Documents and Search
6. Home Dashboard and UI polish

Always build the core feature first before adding supporting features.

## Tech Stack

Use this stack unless instructed otherwise:

- Frontend: Next.js with App Router
- Language: TypeScript
- Styling: TailwindCSS
- Backend: Next.js API Routes or NestJS if separated
- Database: PostgreSQL
- ORM: Prisma
- OCR: Tesseract.js, Google Vision API, or PaddleOCR
- Storage: Local storage or S3-compatible storage
- Scheduler: Cron job or backend scheduler

## Main Features

The system has five major features:

1. Auto-Metadata Extraction
2. Retention Notification Automation
3. Standard Category Vocabularies
4. List of Documents and Search
5. Home Dashboard

## Core Business Rules

1. Every document must be linked to exactly one sub-category.
2. Every sub-category belongs to one main category.
3. `code_MC` in documents/metadata is derived from the selected `code_SC`.
4. `nomor_dokumen` contains a classification code.
5. The classification code is extracted from `nomor_dokumen` and matched with `SUB_CATEGORIES.code_SC`.
6. If the classification code is not found, show an alert and allow manual classification.
7. `tahun_retensi` is calculated from `year(tanggal_dokumen) + retention`.
8. Documents whose retention expires within 6 months must be flagged as expiring soon.
9. The actions `Musnahkan` and `Pertahankan` only appear when the document retention period is within 6 months of expiry.
10. Retention notification runs every 14 days.
11. Destruction should be auditable. Prefer status update or soft delete instead of immediate hard delete.

## Main Database Tables

Use these core tables:

- `MAIN_CATEGORY`
- `SUB_CATEGORIES`
- `METADATA` or `DOCUMENTS`

For detailed schema, read `docs/01-database-schema.md`.

## Routing Summary

Use this route structure:

```txt
/
  Home / Dashboard

/documents
  List of Documents

/documents/[id]
  Document Detail

/upload
  Auto-Metadata upload page

/categories
  Standard Category Vocabularies

/notifications
  Retention notifications
```

## Code Guidelines

1. Use TypeScript.
2. Use reusable components.
3. Keep page files clean.
4. Put business logic in services or utilities.
5. Do not place OCR logic directly in React components.
6. Do not place retention logic directly in React components.
7. Use Prisma models for database operations.
8. Use clear validation before saving data.
9. Use confirmation dialogs for destructive actions.
10. Keep naming consistent and professional.

## Recommended Folder Structure

```txt
app/
  page.tsx
  documents/
    page.tsx
    [id]/
      page.tsx
  upload/
    page.tsx
  categories/
    page.tsx
  notifications/
    page.tsx
  api/
    documents/
    categories/
    notifications/
    ocr/

components/
  layout/
  documents/
  categories/
  notifications/
  ui/

lib/
  db.ts
  ocr.ts
  classification.ts
  retention.ts
  search.ts
  utils.ts

services/
  documentService.ts
  categoryService.ts
  ocrService.ts
  retentionService.ts
  notificationService.ts

types/
  document.ts
  category.ts
  notification.ts
```

## Detailed Documentation

Read details only when working on the related module:

- `docs/00-product-spec.md`
- `docs/01-database-schema.md`
- `docs/02-core-feature-auto-metadata.md`
- `docs/03-core-feature-retention.md`
- `docs/04-supporting-feature-categories.md`
- `docs/05-supporting-feature-documents.md`
- `docs/06-home-dashboard.md`
- `docs/07-implementation-plan.md`

## Important Instruction for Claude Code

Do not load every documentation file at once unless necessary.

When implementing a feature, read only the relevant file from the `docs/` folder.

Example:

- For OCR upload: read `02-core-feature-auto-metadata.md`
- For retention: read `03-core-feature-retention.md`
- For category management: read `04-supporting-feature-categories.md`
