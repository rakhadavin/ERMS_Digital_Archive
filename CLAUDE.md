# CLAUDE.md — Digital Archive Metadata System

## Project Overview

**Competition Topic:** Standard Metadata, Interoperability, and Digital Archive Preservation

**Core Problem:**  
Inconsistency in document classification causes difficulty in document retrieval (temu kembali). Archives are often misclassified or incomplete in their metadata, making precise retrieval nearly impossible.

**Proposed Solution:**  
A web-based system that supports classification consistency through metadata re-structuring, powered by automated metadata extraction and a standardized vocabulary system.

---

## System Architecture

### Technology Stack (Recommended)
- **Frontend:** React + TailwindCSS
- **Backend:** Node.js / Python (FastAPI)
- **Database:** PostgreSQL (relational, supports foreign keys)
- **OCR Engine:** Tesseract.js / Google Vision API / PaddleOCR
- **File Storage:** Local / S3-compatible object storage
- **Scheduler (for notif):** Cron job / Celery Beat

---

## Database Schema

### `MAIN_CATEGORY`
Only root-level codes with no dot separator (e.g. `MR`, `MP`).

| Field     | Type    | Description                        |
|-----------|---------|------------------------------------|
| code_MC   | VARCHAR | Primary Key — root classification code (no dot) |
| name_MC   | VARCHAR | Category name                      |
| desc_MC   | TEXT    | Description of this category       |

### `SUB_CATEGORIES`
All non-root codes regardless of depth — `MR.01`, `MR.01.01`, `MR.01.02.01` — all flattened here.
`code_MC` FK always points to the root code (e.g. `MR`), never to an intermediate level.

| Field            | Type    | Description                                              |
|------------------|---------|----------------------------------------------------------|
| code_MC          | VARCHAR | Foreign Key → MAIN_CATEGORY.code_MC (always root)        |
| code_SC          | VARCHAR | Sub-category code — Primary Key (e.g. `MR.01.02.01`)    |
| name_SC          | VARCHAR | Sub-category name                                        |
| desc_SC          | TEXT    | Description of this sub-category                         |
| retention_aktif  | INT     | Active retention period in years                         |
| retention_inaktif| INT     | Inactive retention period in years                       |
| keterangan       | VARCHAR | Disposition: `'Simpan Permanen'` or `'Musnah'`          |

### `METADATA` (Documents)
| Field                  | Type      | Description                                                |
|------------------------|-----------|------------------------------------------------------------|
| id                     | UUID      | Primary Key (auto-generated)                               |
| unit_pengolah          | VARCHAR   | Processing unit / department                               |
| nomor_dokumen          | VARCHAR   | Document number (contains classification code)             |
| tanggal_dokumen        | DATE      | Document date                                              |
| tahun_retensi_aktif    | INT       | Active retention year: `year(tanggal_dokumen) + retention_aktif`   |
| tahun_retensi_inaktif  | INT       | Inactive retention year: `year(tanggal_dokumen) + retention_inaktif` |
| sifat_dokumen          | VARCHAR   | Document nature/type (e.g., Rahasia, Biasa)                |
| code_SC                | VARCHAR   | Foreign Key → SUB_CATEGORIES.code_SC                       |
| code_MC                | VARCHAR   | Foreign Key → MAIN_CATEGORY.code_MC (derived from SC)      |
| title                  | VARCHAR   | Document title (extracted via OCR)                         |
| description            | TEXT      | Document description (extracted via OCR)                   |
| tentang                | TEXT      | Summary / perihal (extracted via OCR)                      |
| konteks                | TEXT      | Context notes (extracted via OCR)                          |
| file_path              | VARCHAR   | Path/URL to stored file                                    |
| file_type              | VARCHAR   | Type: PDF, DOCX, JPG, etc.                                 |
| created_at             | TIMESTAMP | Upload timestamp                                           |

---

## Core Features

### Feature 1: AUTO-METADATA (Primary Feature)

**Flow:**
1. User uploads a document (PDF, image, DOCX, etc.)
2. System runs OCR / text extraction on the document
3. Extracted text is parsed and mapped to metadata fields:
   - `unit_pengolah`, `nomor_dokumen`, `tanggal_dokumen`, `sifat_dokumen`, `title`, `description`, `tentang`, `konteks`
4. `nomor_dokumen` is parsed/split to extract `kode_classification`
5. `kode_classification` is used as a foreign key lookup:
   - → finds matching `code_SC` in `SUB_CATEGORIES`
   - → retrieves `main_category`, `sub_category`, `retention_aktif`, `retention_inaktif`, and `keterangan`
6. `tahun_retensi_aktif` and `tahun_retensi_inaktif` are auto-calculated:
   - `tahun_retensi_aktif = year(tanggal_dokumen) + retention_aktif`
   - `tahun_retensi_inaktif = year(tanggal_dokumen) + retention_inaktif`
7. User reviews the auto-filled form, edits if needed, then confirms save

**UI Behavior:**
- Upload dropzone (drag & drop or click)
- Loading state while OCR is processing
- Form auto-filled with extracted data, all fields editable
- Classification fields (main_category, sub_category, retention_aktif, retention_inaktif, keterangan) shown as read-only derived fields
- Manual override option if classification code not found

**Key Logic — Nomor Dokumen Parsing:**
```
nomor_dokumen format example: "001/MR.01.02/IV/2024"
split by "/" → parts[1] = "MR.01.02" → this is kode_classification
kode_classification → lookup SUB_CATEGORIES where code_SC = "MR.01.02"
```
> Note: Adjust split logic to match the actual document number format used.

---

### Feature 2: RETENTION NOTIFICATION AUTOMATION (Primary Feature)

**Trigger:** Scheduled job runs every 2 weeks (bi-weekly cron)

**Logic:**
```sql
SELECT * FROM documents
WHERE (
  tahun_retensi_aktif <= EXTRACT(YEAR FROM CURRENT_DATE) + 0.5
  OR tahun_retensi_inaktif <= EXTRACT(YEAR FROM CURRENT_DATE) + 0.5
)
AND action_taken IS NULL
```

**Notification Content (sent to Admin):**
- List of documents whose retention period (aktif or inaktif) expires within the next 6 months
- Each item shows: document title, nomor_dokumen, unit_pengolah, tahun_retensi_aktif, tahun_retensi_inaktif
- Link/button directing to the document's detail page

**Action Options (visible in document detail when retention ≤ 6 months):**
- **Pertahankan (Abadi):** Mark document for permanent retention
- **Musnahkan:** Mark document for destruction / archive disposal

> These two action buttons only appear when the document's retention (aktif or inaktif) is within 6 months of expiry.

**Notification Delivery:** Email to admin (or in-app notification if email not configured)

---

## Complementary Features

### Feature 3: STANDARD CATEGORIES VOCABULARIES

**Purpose:** Manage and standardize the classification vocabulary (main categories and sub-categories).

**Page Layout:**
- Left panel: List of `MAIN_CATEGORY` cards (code + name)
- Right panel: Expanded view of selected main category showing its `SUB_CATEGORIES`

**Actions Available:**
| Action              | Description |
|---------------------|-------------|
| Add Main Category   | Popup form: code_MC, name_MC, desc_MC. Also allows inline addition of sub-categories in the same popup. |
| Add Sub-Category    | Add sub to an existing main category. Fields: code_SC, name_SC, desc_SC, retention_aktif, retention_inaktif, keterangan |
| Edit Main Category  | Edit name_MC and desc_MC |
| Edit Sub-Category   | Edit name_SC, desc_SC, retention_aktif, retention_inaktif, keterangan |
| See Related Documents | Opens a panel showing all documents linked to that main_category OR sub_category |

**Related Documents Panel (See Related Documents):**
- Left side: List of related documents (title, nomor_dokumen, tanggal)
- Right side: Document detail view for selected document, with:
  - All metadata fields
  - **Download** button
  - **Baca (Read/Preview)** button
  - **Musnahkan** button ← only visible if retention ≤ 6 months
  - **Pertahankan** button ← only visible if retention ≤ 6 months

---

### Feature 4: LIST OF DOCUMENTS

**Purpose:** Central document listing page. Also serves as the result page for homepage search.

**Default View:**
- Table/card list of all documents
- Columns: title, nomor_dokumen, unit_pengolah, tanggal_dokumen, main_category, sub_category, tahun_retensi_aktif, tahun_retensi_inaktif, sifat_dokumen

**Search Mechanism:**
- Default search: searches by `main_category` (name_MC)
- **Advanced Search (radio button toggle):**
  - `title` — search by document title
  - `description` — search by description field
  - `tentang` — search by perihal/tentang field
  - `konteks` — search by context field
- Only one radio button active at a time

**Filters:**
| Filter         | Options                            |
|----------------|------------------------------------|
| Tahun          | Year selector (from tanggal_dokumen) |
| Jenis Arsip    | Dropdown (sifat_dokumen values)    |
| Masa Retensi   | "Within 6 months", "1 year", "All" |

**Retention Notification Link Behavior:**
> When user clicks notification email link → redirects to List of Documents with filter `masa_retensi = 6 months` pre-applied.

---

### Feature 5: HOME PAGE / DASHBOARD

**Purpose:** Landing page with quick search and system overview.

**Components:**
- Search bar (searches main_category by default)
- Quick stats: total documents, documents expiring soon, total categories
- Recent uploads
- Notification badge for admin (retention alerts)

---

## Navigation Structure

```
/ (Home / Dashboard)
├── /documents              → List of Documents
│   └── /documents/:id      → Document Detail
├── /upload                 → AUTO-METADATA upload & form
├── /categories             → Standard Categories Vocabularies
│   ├── /categories/add     → Add Main Category (popup)
│   └── /categories/:code   → Main Category Detail + Sub-categories
└── /notifications          → Notification log (admin only)
```

---

## User Roles

| Role  | Permissions |
|-------|-------------|
| Admin | Full access: upload, edit, delete, manage categories, receive notifications, take retention actions |
| User  | View documents, search, download, read |

> Musnahkan and Pertahankan actions are **admin-only**.

---

## Key Business Rules

1. `kode_classification` extracted from `nomor_dokumen` must match an existing `code_SC`. If not found, flag for manual classification.
2. Classification hierarchy: only root codes (no dot) are MC. All other codes (with dot, any depth) are SC, always linked to the root MC.
3. `tahun_retensi_aktif` = `year(tanggal_dokumen)` + `retention_aktif` (from SUB_CATEGORIES)
4. `tahun_retensi_inaktif` = `year(tanggal_dokumen)` + `retention_inaktif` (from SUB_CATEGORIES)
5. Retention action buttons (Musnahkan/Pertahankan) appear when either `tahun_retensi_aktif` or `tahun_retensi_inaktif` is within 6 months of expiry.
6. Notification runs every 14 days and targets documents where either retention year expires within 180 days from today.
7. Each document must be linked to exactly one `sub_category` (and by extension, one `main_category`).
8. `code_MC` in METADATA is always derived from the linked `sub_category`, never set independently.

---

## OCR Extraction Field Mapping

| Extracted Element         | Maps To           |
|---------------------------|-------------------|
| Nomor / No. Surat         | nomor_dokumen     |
| Tanggal / Date            | tanggal_dokumen   |
| Kepada / Dari / Unit      | unit_pengolah     |
| Perihal / Subject         | tentang           |
| Body paragraph summary    | description       |
| Sifat (Rahasia/Biasa etc) | sifat_dokumen     |
| Title / Heading           | title             |

---

## Notes for Development

- OCR accuracy is critical — build a confidence score indicator so users know which fields were auto-filled reliably vs. need manual review
- Highlight auto-filled fields in the form (e.g., yellow background) so users know which to verify
- `nomor_dokumen` parsing pattern should be configurable (different agencies may have different formats)
- The system should be designed to be extensible for future interoperability (e.g., export to Dublin Core, PREMIS, or other archival metadata standards)
- Consider adding an audit log for Musnahkan/Pertahankan actions (who took action, when)
- All date handling should use ISO 8601 format internally
- When displaying retention info in the UI, show both `tahun_retensi_aktif` and `tahun_retensi_inaktif` side by side for clarity
- `keterangan` from the sub-category can be surfaced in the document detail view as a hint for the expected disposition action

---

## Glossary

| Term                  | Meaning |
|-----------------------|---------|
| Temu kembali          | Document retrieval / findability |
| Retensi               | Retention period — how long a document must be kept |
| Retensi Aktif         | Active retention — period while document is in active use |
| Retensi Inaktif       | Inactive retention — period after active use before final disposition |
| Musnahkan             | Destroy / dispose of the document after retention |
| Pertahankan           | Preserve permanently (override retention) |
| Simpan Permanen       | Disposition type — keep permanently, do not destroy |
| Musnah                | Disposition type — destroy after retention period ends |
| Keterangan            | Disposition note on sub-category indicating expected final action |
| Sifat dokumen         | Document classification by sensitivity (Rahasia, Terbatas, Biasa, etc.) |
| Unit pengolah         | The department/unit that owns or processed the document |
| Nomor dokumen         | Document registration number (contains embedded classification code) |
| kode_classification   | The portion of nomor_dokumen that identifies the sub-category |
