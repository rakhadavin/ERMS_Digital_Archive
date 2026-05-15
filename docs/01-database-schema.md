# Database Schema

## Database Recommendation

Use PostgreSQL as the relational database.

Use Prisma as the ORM.

The system needs strong relationships between:

- Main categories
- Sub-categories
- Documents / metadata
- Retention notifications
- Preservation actions

## Core Tables

The system uses three required core tables:

1. `MAIN_CATEGORY`
2. `SUB_CATEGORIES`
3. `METADATA` or `DOCUMENTS`

For implementation, prefer lowercase plural table names:

1. `main_categories`
2. `sub_categories`
3. `documents`

## Table: main_categories

Stores the highest-level classification vocabulary.

| Field | Type | Description |
|---|---|---|
| `code_mc` | VARCHAR | Primary key. Main category code. |
| `name_mc` | VARCHAR | Main category name. |
| `desc_mc` | TEXT | Main category description. |
| `created_at` | TIMESTAMP | Created date. |
| `updated_at` | TIMESTAMP | Updated date. |

### SQL Example

```sql
CREATE TABLE main_categories (
  code_mc VARCHAR(50) PRIMARY KEY,
  name_mc VARCHAR(255) NOT NULL,
  desc_mc TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO main_categories (code_mc, name_mc) VALUES
('MR', 'MONETER'),
('MP', 'MAKROPRUDENSIAL');
```

## Table: sub_categories

Stores sub-categories under each main category.

| Field | Type | Description |
|---|---|---|
| `code_mc` | VARCHAR | Foreign key to `main_categories.code_mc`. |
| `code_sc` | VARCHAR | Primary key. Sub-category code. |
| `name_sc` | VARCHAR | Sub-category name. |
| `desc_sc` | TEXT | Sub-category description. |
| `retention` | INT | Retention period in years. |
| `created_at` | TIMESTAMP | Created date. |
| `updated_at` | TIMESTAMP | Updated date. |

### SQL Example

```sql
CREATE TABLE sub_categories (
  code_sc VARCHAR(50) PRIMARY KEY,
  code_mc VARCHAR(50) NOT NULL,
  name_sc VARCHAR(255) NOT NULL,
  desc_sc TEXT,
  retention_aktif INT,
  retention_inaktif INT,
  keterangan VARCHAR(50),
  retention INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_sub_category_main_category
    FOREIGN KEY (code_mc)
    REFERENCES main_categories(code_mc)
    ON DELETE CASCADE
);

INSERT INTO sub_categories (code_sc, code_mc, name_sc, retention_aktif, retention_inaktif, keterangan) VALUES
('MR.01',       'MR', 'Ekonomi Moneter',                                        3,    2,  'Simpan Permanen'),
('MR.01.01',    'MR', 'Kebijakan',                                               5,    2,  'Simpan Permanen'),
('MR.01.01.01', 'MR', 'Kebijakan Moneter',                                       5,    2,  'Simpan Permanen'),
('MR.01.02',    'MR', 'Penelitian dan Analisa',                                  7,    8,  'Musnah'),
('MR.01.02.01', 'MR', 'Kertas Penelitian dan Analisa',                           3,    5,  'Musnah'),
('MR.01.02.05', 'MR', 'Working Paper',                                           2,    3,  'Musnah'),
('MR.01.03',    'MR', 'Pidato dan Pernyataan Resmi',                             2,    2,  'Simpan Permanen'),
('MR.01.03.02', 'MR', 'Naskah Pidato Pimpinan',                                  3,    2,  'Simpan Permanen'),
('MR.02',       'MR', 'Pengelolaan Moneter',                                     2,    4,  'Musnah'),
('MR.02.02',    'MR', 'Instrumen Moneter',                                       2,    5,  'Simpan Permanen'),
('MR.02.02.01', 'MR', 'Berkas Kebijakan Instrumen Moneter',                      8,    7,  'Musnah'),
('MR.03',       'MR', 'Pengelolaan Cadangan Devisa',                             15,   8,  'Simpan Permanen'),
('MR.03.01',    'MR', 'Kebijakan Cadangan Devisa',                               2, 1,  'Simpan Permanen'),
('MR.03.01.01', 'MR', 'Kebijakan Pengelolaan Cadangan Devisa',                   2,    1,  'Simpan Permanen'),
('MP.01',       'MP', 'Kebijakan Makroprudensial',                               2,    2,  'Simpan Permanen'),
('MP.01.01',    'MP', 'Kebijakan',                                               10,   3,  'Musnah'),
('MP.01.01.01', 'MP', 'Kebijakan Makroprudensial',                               5,    2,  'Simpan Permanen'),
('MP.01.02',    'MP', 'Asesmen Stabilitas Sistem Keuangan',                      5,    3,  'Musnah'),
('MP.01.02.01', 'MP', 'Laporan Hasil Asesmen Stabilitas Sistem Keuangan',        5,    5,  'Simpan Permanen'),
('MP.01.02.06', 'MP', 'Laporan Pengawasan Bank Sistemik',                        5,    5,  'Musnah'),
('MP.01.06',    'MP', 'Protokol Manajemen Krisis',                               5,    7,  'Simpan Permanen'),
('MP.01.06.01', 'MP', 'Berkas Protokol Manajemen Krisis',                        3,    6,  'Musnah'),
('MP.02',       'MP', 'Surveillance Sistem Keuangan',                            2,    5,  'Musnah'),
('MP.02.01',    'MP', 'Kebijakan Surveillance',                                  1,    8,  'Musnah'),
('MP.02.01.01', 'MP', 'Kebijakan Surveillance Sistem Keuangan',                  7,    9,  'Simpan Permanen');
```

## Table: documents

Stores uploaded archive documents and metadata.

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key. |
| `unit_pengolah` | VARCHAR | Processing unit or department. |
| `nomor_dokumen` | VARCHAR | Document number containing classification code. |
| `tanggal_dokumen` | DATE | Document date. |
| `tahun_retensi` | INT | Retention year calculated from document date and retention period. |
| `sifat_dokumen` | VARCHAR | Document nature/type. |
| `code_sc` | VARCHAR | Foreign key to sub-category. |
| `code_mc` | VARCHAR | Derived main category code. |
| `title` | VARCHAR | Document title. |
| `description` | TEXT | Document description. |
| `tentang` | TEXT | Subject / summary / perihal. |
| `konteks` | TEXT | Context notes. |
| `file_path` | VARCHAR | File path or URL. |
| `file_type` | VARCHAR | File type. |
| `created_at` | TIMESTAMP | Upload timestamp. |

### SQL Example

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  unit_pengolah VARCHAR(255),
  nomor_dokumen VARCHAR(255) NOT NULL UNIQUE,
  tanggal_dokumen DATE,
  tahun_retensi_aktif INT,
  tahun_retensi_inaktif INT,
  sifat_dokumen VARCHAR(100),

  code_sc VARCHAR(50) NOT NULL,
  code_mc VARCHAR(50) NOT NULL,

  title VARCHAR(255),
  description TEXT,
  tentang TEXT,
  konteks TEXT,

  file_path VARCHAR(500),
  file_type VARCHAR(100),

  document_status VARCHAR(50) DEFAULT 'ACTIVE',
  action_taken VARCHAR(50),
  action_taken_at TIMESTAMP,
  action_taken_by VARCHAR(255),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_document_sub_category
    FOREIGN KEY (code_sc)
    REFERENCES sub_categories(code_sc),

  CONSTRAINT fk_document_main_category
    FOREIGN KEY (code_mc)
    REFERENCES main_categories(code_mc)
);
```

## Optional Table: retention_notifications

Stores notification records generated by the scheduler.

```sql
CREATE TABLE retention_notifications (
  id UUID PRIMARY KEY,
  document_id UUID NOT NULL,
  notification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'UNREAD',

  CONSTRAINT fk_notification_document
    FOREIGN KEY (document_id)
    REFERENCES documents(id)
    ON DELETE CASCADE
);
```



## Entity Relationship Rules

1. One main category has many sub-categories.
2. One sub-category belongs to one main category.
3. One document belongs to one sub-category.
4. One document indirectly belongs to one main category through its sub-category.
5. `code_mc` in document is derived from `code_sc`, not manually set independently.

## Prisma Direction

Use Prisma models that map to the tables above.

Keep relations explicit:

- `MainCategory` has many `SubCategory`
- `SubCategory` has many `Document`
- `Document` belongs to `SubCategory`
- `Document` belongs to `MainCategory`

## Important Notes

- Prefer `desc_sc`, not `desc_MC`, in the sub-category table.
- Use ISO 8601 format for all internal date handling.
- Keep `nomor_dokumen` unique if the institution treats document number as unique.
- Do not hard-delete documents when users choose `Musnahkan`; use status-based action for auditability.
