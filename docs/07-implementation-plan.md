# Implementation Plan

## Priority Principle

Build the system from core logic first, then UI polish.

Do not start from dashboard visuals before the database, auto-metadata, and retention flow are stable.

## Phase 1 — Project Setup

Tasks:

1. Initialize Next.js project.
2. Install TypeScript and TailwindCSS.
3. Set up Prisma.
4. Connect PostgreSQL.
5. Create base folder structure.
6. Create shared UI components.
7. Create layout and navigation.

Deliverables:

- App runs locally.
- Database connection works.
- Basic routes exist.

## Phase 2 — Database and Models

Tasks:

1. Create `main_categories` table/model.
2. Create `sub_categories` table/model.
3. Create `documents` table/model.
4. Add document status fields.
5. Add relationships.
6. Run migration.
7. Seed sample category data.

Deliverables:

- Prisma schema completed.
- Migration completed.
- Basic seed data available.

## Phase 3 — Core Feature: Auto-Metadata

Tasks:

1. Build upload page.
2. Add upload dropzone.
3. Add OCR service abstraction.
4. Extract text from file.
5. Show extracted text preview.
6. Parse `nomor_dokumen`.
7. Extract classification code.
8. Match with `code_SC`.
9. Auto-fill metadata form.
10. Save document.

Deliverables:

- User can upload a document.
- System extracts and displays text.
- System detects classification.
- User can save metadata.

## Phase 4 — Core Feature: Retention

Tasks:

1. Implement retention calculation.
2. Add retention status utility.
3. Query documents expiring within 6 months.
4. Build notifications page.
5. Build retention filter on documents page.
6. Add `Musnahkan` and `Pertahankan` actions.
7. Add confirmation dialog.
8. Save action status.

Deliverables:

- Admin can see expiring documents.
- Conditional retention actions work.
- Action result is stored.

## Phase 5 — Category Vocabulary

Tasks:

1. Build categories page.
2. Display main categories.
3. Display sub-categories.
4. Add main category modal.
5. Add sub-category modal.
6. Add edit category feature.
7. Add related documents panel.

Deliverables:

- User can manage classification vocabulary.
- User can view related documents.

## Phase 6 — Documents and Search

Tasks:

1. Build documents page.
2. Add default search by main category.
3. Add advanced search radio buttons.
4. Add filters.
5. Build document detail page.
6. Add preview and download actions.

Deliverables:

- Documents are searchable and filterable.
- Document detail page works.

## Phase 7 — Home Dashboard and Polish

Tasks:

1. Build dashboard.
2. Add quick stats.
3. Add recent uploads.
4. Add retention alert badge.
5. Improve UI states.
6. Add loading and error states.
7. Refactor repeated code.

Deliverables:

- Dashboard is usable.
- UI feels coherent.
- Core flows are stable.

## Recommended Build Order for Claude Code

When asking Claude Code to implement, use this order:

1. "Read `CLAUDE.md` and `docs/01-database-schema.md`. Create the Prisma schema."
2. "Read `docs/02-core-feature-auto-metadata.md`. Implement upload and metadata extraction flow."
3. "Read `docs/03-core-feature-retention.md`. Implement retention status and notification page."
4. "Read `docs/04-supporting-feature-categories.md`. Implement category vocabulary CRUD."
5. "Read `docs/05-supporting-feature-documents.md`. Implement document list, search, filters, and detail."
6. "Read `docs/06-home-dashboard.md`. Implement homepage dashboard."

## Rule

Do not ask Claude Code to read every documentation file at once.

Ask it to read only the relevant file for the current feature.
