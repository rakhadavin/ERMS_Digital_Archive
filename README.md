# Sistem Arsip Digital

Sistem manajemen metadata arsip digital berbasis web — mendukung konsistensi klasifikasi melalui ekstraksi metadata otomatis dan kosakata standar.

## Topik Kompetisi
**Metadata Standar, Interoperabilitas, dan Preservasi Arsip Digital**

---

## Cara Menjalankan (Development)

### Prasyarat
- Node.js >= 18.x
- npm >= 9.x

### Langkah

```bash
# 1. Install dependencies
npm install

# 2. Salin file env
cp .env.example .env

# 3. Jalankan development server
npm run dev
```

Buka browser di `http://localhost:5173`

---

## Struktur Folder

```
src/
├── pages/          # Halaman utama (Dashboard, AutoMetadata, dll.)
├── components/
│   ├── layout/     # Sidebar, Topbar
│   └── ui/         # Komponen kecil reusable (Badge, Button, Modal, dll.)
├── data/           # Mock data (sementara, akan diganti API)
├── hooks/          # Custom React hooks
├── utils/          # Helper functions (parsing, kalkulasi)
├── App.jsx         # Router utama
├── main.jsx        # Entry point
└── index.css       # Global styles + Tailwind
```

---

## Fitur

| Fitur | Status |
|-------|--------|
| Dashboard | ✅ Prototype |
| Auto-Metadata (OCR mock) | ✅ Prototype |
| Notifikasi Retensi | ✅ Prototype |
| Daftar Dokumen | 🔧 In Progress |
| Kosakata Kategori | 🔧 In Progress |
| Backend NestJS | ⏳ Belum dimulai |
| Database PostgreSQL | ⏳ Belum dimulai |

---

## Stack Teknologi

- **Frontend:** React 18 + Vite + TailwindCSS
- **Icons:** Tabler Icons + Lucide React
- **Router:** React Router v6
- **Backend (nanti):** NestJS + Prisma + PostgreSQL
- **OCR (nanti):** Tesseract.js / Google Vision API
