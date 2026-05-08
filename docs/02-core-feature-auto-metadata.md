# Core Feature — Auto-Metadata Extraction

## Purpose

Auto-Metadata Extraction is the first core feature.

It allows users to upload documents and automatically generate metadata suggestions using OCR or text extraction.

The main goal is to reduce manual metadata entry and improve classification consistency.

## Main Flow

1. User opens the upload page.
2. User uploads a document file.
3. System validates file type and size.
4. System runs OCR or text extraction.
5. System extracts text from the document.
6. System maps extracted text into metadata fields.
7. System detects `nomor_dokumen`.
8. System parses `nomor_dokumen` to extract `kode_classification`.
9. System matches `kode_classification` with `SUB_CATEGORIES.code_SC`.
10. System retrieves main category, sub-category, and retention period.
11. System calculates `tahun_retensi`.
12. System auto-fills the metadata form.
13. User reviews and edits the form if needed.
14. User confirms and saves the document.

## Upload Page

Route:

```txt
/upload
```

Main UI components:

- Upload dropzone
- OCR loading state
- Extracted text preview
- Auto-filled metadata form
- Classification result section
- Save button
- Manual override option

## Supported File Types

Initial supported file types:

- PDF
- JPG
- PNG
- DOCX

The implementation may start with PDF and image support first.

## OCR Engine

Recommended options:

- Tesseract.js
- Google Vision API
- PaddleOCR

OCR logic must not be placed directly inside React components.

Use a service abstraction:

```ts
export interface OCRService {
  extractText(file: File): Promise<string>;
}
```

## Metadata Field Mapping

| Extracted Element | Maps To |
|---|---|
| Nomor / No. Surat | `nomor_dokumen` |
| Tanggal / Date | `tanggal_dokumen` |
| Kepada / Dari / Unit | `unit_pengolah` |
| Perihal / Subject | `tentang` |
| Body paragraph summary | `description` |
| Sifat | `sifat_dokumen` |
| Title / Heading | `title` |

## Nomor Dokumen Parsing

Example format:

```txt
001/KU.01/IV/2024
```

Parsing logic:

```txt
split by "/" → parts[1] = "KU.01"
kode_classification = "KU.01"
```

Then:

```txt
kode_classification → lookup SUB_CATEGORIES where code_SC = "KU.01"
```

## Classification Matching

If `code_SC` is found:

System retrieves:

- `code_SC`
- `name_SC`
- `code_MC`
- `name_MC`
- `retention`

Then system auto-fills:

- Main category
- Sub-category
- Retention period
- Retention year

If `code_SC` is not found:

Show alert:

```txt
Classification code was detected, but it is not registered in the standard vocabulary. Please select a category manually or create a new sub-category.
```

## Retention Year Calculation

Formula:

```txt
tahun_retensi = year(tanggal_dokumen) + retention
```

Example:

```txt
tanggal_dokumen = 2024-04-10
retention = 5
tahun_retensi = 2029
```

## Auto-Filled Field Behavior

All auto-filled fields must remain editable.

Recommended UX:

- Highlight auto-filled fields.
- Show confidence indicator if available.
- Allow manual correction.
- Show clear warning if OCR result is uncertain.

## Edge Cases

Handle these cases:

1. OCR fails.
2. OCR result is incomplete.
3. Document number is not found.
4. Document number format is invalid.
5. Classification code is not found.
6. Classification code is found but retention is missing.
7. File type is unsupported.
8. File is too large.
9. Duplicate document number exists.
10. User wants to override detected metadata.

## Suggested Services

Create these files:

```txt
services/ocrService.ts
services/documentService.ts
lib/classification.ts
lib/retention.ts
```

## Suggested Utility

```ts
export function parseClassificationCode(nomorDokumen: string): string | null {
  if (!nomorDokumen) return null;

  const parts = nomorDokumen.split("/");
  const code = parts.find((part) => /^[A-Z]{2,}\.\d{1,}$/.test(part.trim()));

  return code ? code.trim() : null;
}
```

## Implementation Priority

Build this feature after the database schema is ready.

Minimum viable version:

1. Upload file.
2. Extract text.
3. Display extracted text.
4. Detect document number.
5. Parse classification code.
6. Match sub-category.
7. Auto-fill form.
8. Save document.
