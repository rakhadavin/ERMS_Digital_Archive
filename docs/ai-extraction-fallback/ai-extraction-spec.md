# ai-autometadata-spec.md
# Feature Spec: AUTO-METADATA — AI/OCR Extraction Engine
# Digital Archive Metadata System

---

## Overview

**Nama Fitur:** Auto-Metadata  
**Tipe:** Primary Feature  
**Tujuan:** Mengekstrak metadata dokumen arsip secara otomatis dari file yang diupload (PDF, gambar, DOCX), memetakannya ke field metadata standar, dan mengklasifikasikan dokumen berdasarkan vocabulary kategori yang sudah ada.

**Masalah yang diselesaikan:**
- Dokumen arsip sering memiliki kop surat (letterhead) di posisi tidak konsisten — atas, tengah, atau setelah pembuka
- Tidak semua dokumen memiliki label eksplisit (contoh: `Nomor:`, `Tanggal:`) — informasi bisa tersirat dalam format bebas
- Proses entry metadata manual memakan waktu dan rawan error/inkonsistensi

**Solusi:**  
Pipeline ekstraksi 3 layer: OCR layout-aware → rule-based parser → LLM fallback (Gemini Flash), yang menghasilkan metadata terstruktur beserta confidence score per field.

---

## Posisi dalam Sistem

Auto-Metadata adalah satu fitur dari sistem Digital Archive Metadata yang lebih besar. Fitur ini berjalan melalui **AI/OCR Microservice** yang terpisah dari main backend.

```
┌─────────────────┐         ┌──────────────────────┐         ┌──────────────┐
│   Frontend      │ ──────► │  Node.js / NestJS    │ ──────► │  PostgreSQL  │
│   React +       │         │  (Main Backend)       │         │  (Database)  │
│   TailwindCSS   │         │                       │         └──────────────┘
└─────────────────┘         └──────────┬───────────┘
                                        │
                                        │ HTTP REST
                                        │ POST /extract
                                        ▼
                              ┌──────────────────────┐
                              │  Python Microservice  │
                              │  (AI/OCR Service)     │
                              │                       │
                              │  - PaddleOCR          │
                              │  - Rule-Based Parser  │
                              │  - Gemini Flash API   │
                              └──────────────────────┘
```

---

## Technology Stack

| Komponen | Teknologi | Keterangan |
|---|---|---|
| Frontend | React + TailwindCSS | Upload UI, form preview |
| Main Backend | Node.js → NestJS | Orchestration, DB, auth |
| AI/OCR Microservice | Python 3.10+ + FastAPI | Extraction engine |
| OCR Engine | PaddleOCR | Layout-aware OCR |
| LLM Fallback | Google Gemini Flash API | Free tier, structured JSON output |
| PDF Parser | pdfplumber | Text-based PDF extraction |
| Image Handler | Pillow | Image preprocessing |
| Database | PostgreSQL + Prisma | Document & category storage |
| Containerization | Docker | Planned — production phase only |

### Port Convention (Development)

| Service | Port |
|---|---|
| Frontend (React) | 5173 |
| Main Backend (Node/NestJS) | 3000 |
| AI/OCR Microservice (FastAPI) | 8000 |

> Untuk simulasi/development: semua service dijalankan manual tanpa Docker.

---

## Setup Google Gemini API Key

1. Buka **https://aistudio.google.com**
2. Login menggunakan akun Google
3. Klik **"Get API Key"** di sidebar kiri
4. Klik **"Create API key"**
5. Pilih project Google Cloud (atau buat baru)
6. Copy API key — simpan di file `.env`

```env
# .env — Python Microservice
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

> **Free tier Gemini Flash:** 15 requests/menit, 1 juta token/hari — lebih dari cukup untuk simulasi.

---

## End-to-End Flow

```
User upload file (PDF / Image / DOCX)
         │
         ▼
Frontend → POST /upload → NestJS
         │
         ▼
NestJS → POST /extract (multipart) → FastAPI Microservice
         │
         ▼
  [Extraction Pipeline — 3 Layer]
         │
         ▼
FastAPI → return { fields, confidence, method_used }
         │
         ▼
NestJS:
  1. Parse kode_classification dari nomor_dokumen
  2. Lookup sub_categories WHERE code_sc = kode_classification
  3. Hitung tahun_retensi = year(tanggal_dokumen) + retention
  4. [Tidak ditemukan] → flag manual_classification_required = true
         │
         ▼
Return semua data ke Frontend
         │
         ▼
Form auto-filled + confidence highlighting
User review → edit jika perlu → Save
         │
         ▼
NestJS → INSERT into documents (PostgreSQL)
```

---

## Extraction Pipeline — 3 Layer

Pipeline berjalan berurutan. Layer berikutnya hanya aktif jika layer sebelumnya gagal atau confidence di bawah threshold.

```
INPUT: File (PDF / Image / DOCX)
         │
         ▼
┌─────────────────────────────────┐
│  LAYER 1: OCR + Layout Detection│
│  → PaddleOCR                    │
│  → Detect: header, body, footer │
│  → Extract raw text per region  │
└──────────────┬──────────────────┘
               │ raw_text + regions
               ▼
┌─────────────────────────────────┐
│  LAYER 2: Rule-Based Extraction │
│  → Regex patterns               │
│  → Label detection              │
│  → Positional heuristics        │
│  → Confidence scoring           │
└──────────────┬──────────────────┘
               │
       [confidence < 60
        OR required fields missing?]
               │ YES
               ▼
┌─────────────────────────────────┐
│  LAYER 3: Gemini Flash API      │
│  → Send raw_text as prompt      │
│  → Request structured JSON      │
│  → Fill missing/low-conf fields │
└──────────────┬──────────────────┘
               │
               ▼
OUTPUT: { fields, confidence, method_used }
```

---

## Layer 1 — OCR + Layout Detection (PaddleOCR)

### Tujuan
- Ekstrak teks dari dokumen
- Deteksi region layout: **header (kop surat)**, **body**, **footer**
- Pisahkan konten kop surat dari konten dokumen aktual

### Masalah Kop Surat
Kop surat bisa muncul di posisi tidak konsisten:
- Di bagian atas halaman (paling umum)
- Di tengah halaman
- Setelah konten pembuka

### Strategi Deteksi Kop Surat

PaddleOCR mengembalikan bounding box per text block. Gunakan posisi Y relatif dan keyword detection untuk mengklasifikasikan region:

```python
def classify_region(block):
    y_position = block['bbox'][1]       # top-left Y coordinate
    text = block['text']
    page_height = block['page_height']
    relative_y = y_position / page_height

    # Top 25% halaman + mengandung kata institusional → kop surat
    if relative_y < 0.25 and is_institutional_text(text):
        return 'header'

    if contains_nomor_pattern(text) or contains_tanggal_pattern(text):
        return 'metadata_line'

    if contains_perihal_pattern(text):
        return 'perihal_line'

    return 'body'


def is_institutional_text(text: str) -> bool:
    kop_keywords = [
        'kementerian', 'dinas', 'badan', 'lembaga',
        'republik indonesia', 'jl.', 'jalan', 'telp', 'fax',
        'provinsi', 'kabupaten', 'kota', 'pemerintah'
    ]
    return any(kw in text.lower() for kw in kop_keywords)
```

### Output Layer 1

```json
{
  "raw_text": "full concatenated extracted text",
  "regions": {
    "header": ["KEMENTERIAN DALAM NEGERI", "Jl. Medan Merdeka Utara No.7 ..."],
    "body": ["Nomor: 001/KU.01/IV/2024", "Perihal: Pengadaan ...", "..."],
    "footer": ["Hormat kami,", "Ttd.", "Nama Pejabat"]
  }
}
```

---

## Layer 2 — Rule-Based Extraction

### Tujuan
Ekstrak field metadata menggunakan regex dan label detection pada teks yang sudah dipisahkan per region oleh Layer 1.

### Field Mapping & Regex Patterns

| Field | Label yang Dicari | Regex Pattern |
|---|---|---|
| `nomor_dokumen` | Nomor, No., No. Surat | `(?:nomor\|no\.?)\s*[:\-]?\s*([\w\/\.\-]+)` |
| `tanggal_dokumen` | Tanggal, Tgl | `(?:tanggal\|tgl\.?)\s*[:\-]?\s*(\d{1,2}[\s\-\/]\w+[\s\-\/]\d{4})` |
| `unit_pengolah` | Kepada, Dari, Yth | `(?:kepada\|dari\|yth\.?)\s*[:\-]?\s*(.+)` |
| `sifat_dokumen` | Sifat | `(?:sifat)\s*[:\-]?\s*(rahasia\|terbatas\|biasa\|terbuka)` |
| `tentang` | Perihal, Hal, Subject | `(?:perihal\|hal\.?\|subject)\s*[:\-]?\s*(.+)` |
| `title` | — | Heuristic: baris pendek (< 80 char) di awal body, huruf kapital |
| `description` | — | Heuristic: paragraf pertama body setelah metadata lines |
| `konteks` | — | Heuristic: paragraf terakhir atau kalimat latar belakang |

### Nomor Dokumen → kode_classification

```python
import re

def extract_kode_classification(nomor_dokumen: str) -> str | None:
    """
    Format contoh: "001/KU.01/IV/2024"
    Split by "/" → ambil index 1 → "KU.01"
    """
    parts = nomor_dokumen.split('/')
    if len(parts) >= 2:
        kode = parts[1].strip()
        # Validasi format: HURUF.ANGKA (e.g. KU.01, SDM.02, HK.01)
        if re.match(r'^[A-Z]+\.\d{2}$', kode):
            return kode
    return None
```

> **Catatan:** Pola split configurable via environment variable — format nomor dokumen berbeda antar instansi.

### Confidence Scoring

```python
def calculate_confidence(method: str) -> int:
    scores = {
        'explicit_label': 90,   # Label ditemukan eksplisit (Nomor:, Perihal:, dst)
        'positional':     70,   # Berdasarkan posisi dalam dokumen
        'heuristic':      55,   # Tebakan berdasarkan pola umum
        'not_found':       0,   # Tidak ditemukan
    }
    return scores.get(method, 0)
```

### Threshold Fallback ke Layer 3

```python
CONFIDENCE_THRESHOLD = 60

REQUIRED_FIELDS = ['nomor_dokumen', 'tanggal_dokumen', 'tentang', 'title']

def needs_llm_fallback(extracted: dict) -> bool:
    for field in REQUIRED_FIELDS:
        score = extracted.get(field, {}).get('confidence', 0)
        if score < CONFIDENCE_THRESHOLD:
            return True
    return False
```

---

## Layer 3 — Gemini Flash API (LLM Fallback)

### Kapan Aktif
- Satu atau lebih required field kosong atau confidence < 60
- Label tidak ditemukan eksplisit di dokumen
- Dokumen tidak mengikuti format standar

### System Prompt

```
Kamu adalah sistem ekstraksi metadata dokumen arsip resmi Indonesia.

Tugasmu: ekstrak informasi dari teks dokumen dan kembalikan HANYA dalam format JSON.
Jangan tambahkan penjelasan, markdown, atau teks lain di luar JSON.

Field yang harus diekstrak:
- title: judul atau heading utama dokumen (bukan nama instansi/kop surat)
- nomor_dokumen: nomor surat resmi (format umum: angka/kode/bulan-romawi/tahun)
- tanggal_dokumen: tanggal dokumen dalam format YYYY-MM-DD
- unit_pengolah: unit/divisi/bagian pengirim atau pengolah dokumen
- sifat_dokumen: sifat kerahasiaan — pilih salah satu: Rahasia / Terbatas / Biasa / Terbuka
- tentang: perihal atau subject surat (ringkasan singkat maksimal 1 baris)
- description: ringkasan isi dokumen dalam 1-2 kalimat
- konteks: konteks atau latar belakang tambahan jika ada (boleh null)

Aturan penting:
- Jika field tidak ditemukan dalam teks, isi dengan null — jangan mengarang
- Abaikan teks kop surat: nama instansi, alamat, nomor telepon, fax
- tanggal_dokumen WAJIB dalam format ISO 8601: YYYY-MM-DD
- Kembalikan HANYA JSON valid, tidak ada teks lain sebelum atau sesudah
```

### User Prompt (per request)

```python
def build_user_prompt(raw_text: str, missing_fields: list[str]) -> str:
    return f"""
Ekstrak metadata dari teks dokumen arsip berikut.

Field yang belum berhasil diekstrak (fokus pada ini): {', '.join(missing_fields)}

--- TEKS DOKUMEN ---
{raw_text}
--- AKHIR TEKS ---

Kembalikan hasil dalam format JSON sesuai instruksi sistem.
"""
```

### Gemini API Call

```python
import json
import os
import google.generativeai as genai

SYSTEM_PROMPT = "..."  # System prompt di atas

def call_gemini(raw_text: str, missing_fields: list[str]) -> dict:
    genai.configure(api_key=os.environ['GEMINI_API_KEY'])
    model = genai.GenerativeModel(
        model_name=os.environ.get('GEMINI_MODEL', 'gemini-1.5-flash'),
        system_instruction=SYSTEM_PROMPT
    )

    user_prompt = build_user_prompt(raw_text, missing_fields)

    response = model.generate_content(
        user_prompt,
        generation_config=genai.GenerationConfig(
            temperature=0.1,                      # Low temp untuk konsistensi
            response_mime_type="application/json" # Force JSON output
        )
    )

    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        # Fallback: strip markdown fences jika ada
        clean = response.text.strip().strip('```json').strip('```').strip()
        return json.loads(clean)
```

---

## FastAPI Endpoint

### `POST /extract`

**Request:**
```
Content-Type: multipart/form-data
Field: file → binary (PDF / JPG / PNG / DOCX)
```

**Response — Success:**
```json
{
  "success": true,
  "method_used": "rule-based",
  "fields": {
    "title": "Surat Keputusan Direktur No. 017",
    "nomor_dokumen": "017/SDM.02/VII/2024",
    "tanggal_dokumen": "2024-07-15",
    "unit_pengolah": "Divisi SDM",
    "sifat_dokumen": "Biasa",
    "tentang": "Penetapan Tim Evaluasi Kinerja Semester I Tahun 2024",
    "description": "Surat keputusan ini menetapkan susunan tim evaluasi kinerja pegawai untuk periode semester pertama tahun anggaran 2024.",
    "konteks": null,
    "kode_classification": "SDM.02"
  },
  "confidence": {
    "title": 92,
    "nomor_dokumen": 98,
    "tanggal_dokumen": 95,
    "unit_pengolah": 88,
    "sifat_dokumen": 85,
    "tentang": 90,
    "description": 75,
    "konteks": null
  }
}
```

**method_used values:**
| Value | Meaning |
|---|---|
| `rule-based` | Semua required field berhasil diekstrak oleh Layer 2 |
| `llm` | Layer 2 gagal total, semua dari Gemini |
| `hybrid` | Sebagian dari Layer 2, sebagian dari Gemini |

**Response — Error:**
```json
{
  "success": false,
  "error": "OCR failed: unsupported file type",
  "fields": null,
  "confidence": null
}
```

---

## NestJS Integration

### Service Call

```typescript
// auto-metadata.service.ts
async extractMetadata(file: Express.Multer.File): Promise<ExtractionResult> {
  const formData = new FormData();
  formData.append('file', file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  const response = await this.httpService.post(
    `${process.env.AI_SERVICE_URL}/extract`,
    formData,
    { headers: formData.getHeaders() }
  ).toPromise();

  return response.data;
}
```

```env
# .env — NestJS
AI_SERVICE_URL=http://localhost:8000
```

### Post-Extraction Logic (NestJS)

```typescript
async processExtraction(result: ExtractionResult) {
  const { fields } = result;

  // 1. Parse kode_classification dari nomor_dokumen
  const kode = parseKodeClassification(fields.nomor_dokumen);

  // 2. Lookup sub_categories
  const subCategory = await prisma.subCategory.findUnique({
    where: { code_sc: kode },
    include: { mainCategory: true }
  });

  if (!subCategory) {
    return { ...fields, manual_classification_required: true };
  }

  // 3. Hitung tahun_retensi
  const tahunDokumen = new Date(fields.tanggal_dokumen).getFullYear();
  const tahunRetensi = tahunDokumen + subCategory.retention;

  return {
    ...fields,
    code_sc: subCategory.code_sc,
    code_mc: subCategory.code_mc,
    tahun_retensi: tahunRetensi,
    manual_classification_required: false
  };
}
```

---

## OCR Field Mapping Reference

| Extracted Element | Maps To | Label Eksplisit | Fallback |
|---|---|---|---|
| Nomor / No. Surat | `nomor_dokumen` | Nomor, No., No. Surat | — |
| Tanggal / Date | `tanggal_dokumen` | Tanggal, Tgl | — |
| Kepada / Dari / Unit | `unit_pengolah` | Kepada, Dari, Yth | — |
| Perihal / Subject | `tentang` | Perihal, Hal, Subject | — |
| Sifat | `sifat_dokumen` | Sifat | Default: Biasa |
| Title / Heading | `title` | — | Baris pendek kapital di awal body |
| Body summary | `description` | — | Paragraf pertama body |
| Latar belakang | `konteks` | — | Paragraf terakhir / null |

---

## Confidence Score — UI Behavior

| Confidence | UI Treatment |
|---|---|
| ≥ 85 | Background putih — normal, tidak perlu review |
| 60 – 84 | Background kuning — disarankan review |
| < 60 | Background oranye + warning icon — perlu koreksi |
| null / 0 | Field kosong + label "Isi Manual" |

---

## File Structure — Python Microservice

```
ai-ocr-service/
├── main.py                    # FastAPI app entry point
├── requirements.txt
├── .env
├── routers/
│   └── extract.py             # POST /extract endpoint
├── services/
│   ├── ocr_service.py         # Layer 1: PaddleOCR + layout detection
│   ├── parser_service.py      # Layer 2: Rule-based + regex
│   └── gemini_service.py      # Layer 3: Gemini Flash API
├── utils/
│   ├── file_handler.py        # PDF/Image/DOCX preprocessing
│   ├── confidence.py          # Confidence scoring logic
│   └── nomor_parser.py        # nomor_dokumen → kode_classification
└── config.py                  # Environment variables
```

---

## Development Setup (Tanpa Docker)

```bash
# 1. Setup Python Microservice
cd ai-ocr-service
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

pip install fastapi uvicorn \
            paddleocr paddlepaddle \
            google-generativeai \
            pdfplumber \
            python-multipart \
            pillow \
            python-dotenv

uvicorn main:app --reload --port 8000

# 2. Setup Main Backend
cd ../backend
npm install
npm run dev                        # Runs on port 3000

# 3. Setup Frontend
cd ../frontend
npm install
npm run dev                        # Runs on port 5173
```

---

## Batasan & Catatan Penting

1. **File type priority (simulasi):** PDF dan JPG/PNG dahulu — DOCX menyusul
2. **Kop surat detection** tidak 100% akurat — user selalu bisa edit hasil di form
3. **Gemini free tier:** Rate limit 15 req/menit — cukup untuk simulasi, perlu upgrade untuk production
4. **nomor_dokumen parsing** bersifat configurable — sesuaikan format per instansi via env config
5. **Confidence score** adalah estimasi — bukan jaminan akurasi field
6. Semua tanggal diproses dalam format **ISO 8601** secara internal (`YYYY-MM-DD`)
7. Jika `kode_classification` tidak ditemukan di DB → flag `manual_classification_required = true`, jangan block user

---

*Spec version: 1.0 — Fase Simulasi/Development*  
*Scope: Auto-Metadata Feature only*
