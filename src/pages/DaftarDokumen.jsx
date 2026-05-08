'use client'

import { useState, useMemo } from 'react'

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockDokumen = [
  {
    id: "d-001",
    unit_pengolah: "Divisi Keuangan",
    nomor_dokumen: "001/KU.01/IV/2024",
    tanggal_dokumen: "2024-04-12",
    tahun_retensi: 2034,
    sifat_dokumen: "Biasa",
    status: "Aktif",
    code_SC: "KU.01",
    code_MC: "KU",
    title: "Surat Keputusan Pengadaan Barang Inventaris Kantor 2024",
    description: "SK menetapkan prosedur dan pagu anggaran untuk pengadaan barang inventaris kantor TA 2024.",
    tentang: "Penetapan Anggaran Pengadaan Barang Inventaris Kantor TA 2024",
    konteks: "Pengadaan melalui e-katalog LKPP sesuai Perpres No. 16 Tahun 2018.",
    file_path: "/mock/KU01-001-2024.pdf",
    file_type: "PDF",
    created_at: "2024-04-15T08:23:11Z",
    tindakan_retensi: null,
  },
  {
    id: "d-002",
    unit_pengolah: "Divisi Audit",
    nomor_dokumen: "024/KU.02/I/2024",
    tanggal_dokumen: "2024-01-15",
    tahun_retensi: 2024,
    sifat_dokumen: "Rahasia",
    status: "Aktif",
    code_SC: "KU.02",
    code_MC: "KU",
    title: "Laporan Audit Internal Keuangan Q1 2024",
    description: "Laporan hasil audit internal terhadap laporan keuangan kuartal pertama 2024.",
    tentang: "Hasil Pemeriksaan Keuangan Kuartal I Tahun 2024",
    konteks: "Audit dilaksanakan oleh tim SPI berdasarkan PKPT disetujui Direktur Utama.",
    file_path: "/mock/KU02-024-2024.pdf",
    file_type: "PDF",
    created_at: "2024-01-20T14:05:32Z",
    tindakan_retensi: null,
  },
  {
    id: "d-003",
    unit_pengolah: "Divisi Umum",
    nomor_dokumen: "007/UM.04/II/2024",
    tanggal_dokumen: "2024-02-20",
    tahun_retensi: 2029,
    sifat_dokumen: "Biasa",
    status: "Aktif",
    code_SC: "UM.04",
    code_MC: "UM",
    title: "Berita Acara Serah Terima Aset Perangkat IT Batch 3",
    description: "Berita acara serah terima 24 unit laptop dan 8 unit printer dari Divisi Pengadaan.",
    tentang: "Serah Terima Aset Perangkat Teknologi Informasi Gelombang III",
    konteks: "Bagian dari program modernisasi perangkat kerja 2024-2025.",
    file_path: "/mock/UM04-007-2024.pdf",
    file_type: "PDF",
    created_at: "2024-02-21T09:12:00Z",
    tindakan_retensi: null,
  },
  {
    id: "d-004",
    unit_pengolah: "Divisi Hukum",
    nomor_dokumen: "012/HK.01/III/2024",
    tanggal_dokumen: "2024-03-01",
    tahun_retensi: 2054,
    sifat_dokumen: "Biasa",
    status: "Aktif",
    code_SC: "HK.01",
    code_MC: "HK",
    title: "SK Pembentukan Tim Proyek Transformasi Digital Alpha",
    description: "SK Direktur Utama mengenai pembentukan tim lintas fungsi proyek transformasi digital.",
    tentang: "Pembentukan Tim Proyek Transformasi Digital Fase I (Alpha)",
    konteks: "Proyek Alpha inisiatif strategis 5 tahun dalam road map digitalisasi 2024–2028.",
    file_path: "/mock/HK01-012-2024.pdf",
    file_type: "PDF",
    created_at: "2024-03-05T10:44:22Z",
    tindakan_retensi: null,
  },
  {
    id: "d-005",
    unit_pengolah: "Divisi Hukum",
    nomor_dokumen: "003/HK.02/I/2024",
    tanggal_dokumen: "2024-01-05",
    tahun_retensi: 2034,
    sifat_dokumen: "Rahasia",
    status: "Aktif",
    code_SC: "HK.02",
    code_MC: "HK",
    title: "Kontrak Kerja Sama Layanan Cloud Infrastructure Vendor XYZ",
    description: "PKS antara perusahaan dengan PT XYZ Teknologi mengenai layanan cloud infrastructure 3 tahun.",
    tentang: "Perjanjian Kerja Sama Layanan Cloud Infrastructure 2024–2027",
    konteks: "Hasil negosiasi ulang dengan penambahan klausul SLA 99,9%.",
    file_path: "/mock/HK02-003-2024.pdf",
    file_type: "PDF",
    created_at: "2024-01-08T11:30:00Z",
    tindakan_retensi: null,
  },
  {
    id: "d-006",
    unit_pengolah: "Divisi SDM",
    nomor_dokumen: "031/SDM.01/V/2024",
    tanggal_dokumen: "2024-05-10",
    tahun_retensi: 2029,
    sifat_dokumen: "Terbuka",
    status: "Aktif",
    code_SC: "SDM.01",
    code_MC: "SDM",
    title: "Pengumuman Rekrutmen Pegawai Baru Gelombang II Tahun 2024",
    description: "Pengumuman resmi pembukaan rekrutmen untuk 15 posisi di berbagai divisi.",
    tentang: "Pengumuman Penerimaan Pegawai Baru Gelombang II 2024",
    konteks: "Rekrutmen untuk memenuhi kebutuhan SDM dalam rangka ekspansi layanan regional.",
    file_path: "/mock/SDM01-031-2024.pdf",
    file_type: "PDF",
    created_at: "2024-05-12T08:00:00Z",
    tindakan_retensi: null,
  },
  {
    id: "d-007",
    unit_pengolah: "Divisi Keuangan",
    nomor_dokumen: "042/KU.03/VI/2024",
    tanggal_dokumen: "2024-06-01",
    tahun_retensi: 2025,
    sifat_dokumen: "Terbatas",
    status: "Aktif",
    code_SC: "KU.03",
    code_MC: "KU",
    title: "Nota Dinas Penyesuaian Anggaran Semester II 2024",
    description: "Nota dinas kepada seluruh kepala divisi mengenai penyesuaian pagu anggaran semester kedua.",
    tentang: "Penyesuaian Pagu Anggaran Divisi Semester II TA 2024",
    konteks: "Penyesuaian berdasarkan rapat koordinasi keuangan tanggal 28 Mei 2024.",
    file_path: "/mock/KU03-042-2024.docx",
    file_type: "DOCX",
    created_at: "2024-06-03T13:15:00Z",
    tindakan_retensi: null,
  },
  {
    id: "d-008",
    unit_pengolah: "Divisi Umum",
    nomor_dokumen: "001/UM.01/XII/2023",
    tanggal_dokumen: "2023-12-31",
    tahun_retensi: 2028,
    sifat_dokumen: "Terbuka",
    status: "Aktif",
    code_SC: "UM.01",
    code_MC: "UM",
    title: "Laporan Tahunan Kegiatan Organisasi Tahun 2023",
    description: "Kompilasi laporan kegiatan seluruh divisi sepanjang tahun 2023.",
    tentang: "Laporan Tahunan Kegiatan & Capaian Kinerja Tahun 2023",
    konteks: "Disampaikan kepada Dewan Pengawas dalam rapat tahunan Januari 2024.",
    file_path: "/mock/UM01-001-2023.pdf",
    file_type: "PDF",
    created_at: "2024-01-10T16:00:00Z",
    tindakan_retensi: null,
  },
  {
    id: "d-009",
    unit_pengolah: "Divisi IT",
    nomor_dokumen: "005/IT.02/III/2024",
    tanggal_dokumen: "2024-03-18",
    tahun_retensi: 2034,
    sifat_dokumen: "Rahasia",
    status: "Aktif",
    code_SC: "IT.02",
    code_MC: "IT",
    title: "Laporan Insiden Keamanan Siber Maret 2024",
    description: "Laporan lengkap mengenai insiden percobaan intrusi pada sistem core banking.",
    tentang: "Laporan Insiden & Mitigasi Keamanan Sistem Maret 2024",
    konteks: "Insiden ditangani dalam 4 jam. Tidak ada kebocoran data yang terkonfirmasi.",
    file_path: "/mock/IT02-005-2024.pdf",
    file_type: "PDF",
    created_at: "2024-03-20T09:00:00Z",
    tindakan_retensi: null,
  },
  {
    id: "d-010",
    unit_pengolah: "Divisi SDM",
    nomor_dokumen: "017/SDM.02/VII/2024",
    tanggal_dokumen: "2024-07-15",
    tahun_retensi: 2029,
    sifat_dokumen: "Biasa",
    status: "Aktif",
    code_SC: "SDM.02",
    code_MC: "SDM",
    title: "SK Penetapan Tim Evaluasi Kinerja Semester I 2024",
    description: "SK yang menetapkan susunan tim evaluasi kinerja pegawai semester pertama 2024.",
    tentang: "Penetapan Tim Evaluasi Kinerja Pegawai Semester I Tahun 2024",
    konteks: "Evaluasi berdasarkan KPI yang ditetapkan pada rapat kerja Januari 2024.",
    file_path: "/mock/SDM02-017-2024.pdf",
    file_type: "PDF",
    created_at: "2024-07-16T10:30:00Z",
    tindakan_retensi: null,
  },
  {
    id: "d-011",
    unit_pengolah: "Divisi Hubungan Publik",
    nomor_dokumen: "008/PR.01/VIII/2024",
    tanggal_dokumen: "2024-08-01",
    tahun_retensi: 2034,
    sifat_dokumen: "Terbuka",
    status: "Aktif",
    code_SC: "PR.01",
    code_MC: "PR",
    title: 'Siaran Pers Peluncuran Layanan Digital Baru "ArsipKu"',
    description: "Press release resmi peluncuran aplikasi ArsipKu untuk masyarakat umum.",
    tentang: "Peluncuran Resmi Aplikasi Layanan Digital ArsipKu untuk Publik",
    konteks: "Peluncuran bertepatan dengan Hari Arsip Nasional 18 Agustus 2024.",
    file_path: "/mock/PR01-008-2024.pdf",
    file_type: "PDF",
    created_at: "2024-08-02T07:00:00Z",
    tindakan_retensi: null,
  },
  {
    id: "d-012",
    unit_pengolah: "Divisi Umum",
    nomor_dokumen: "019/UM.02/IX/2024",
    tanggal_dokumen: "2024-09-10",
    tahun_retensi: 2029,
    sifat_dokumen: "Biasa",
    status: "Aktif",
    code_SC: "UM.02",
    code_MC: "UM",
    title: "Notulen Rapat Koordinasi Strategis Q3 2024",
    description: "Notulensi rapat koordinasi pimpinan divisi membahas evaluasi capaian Q3.",
    tentang: "Notulen Rapat Koordinasi Pimpinan Kuartal III 2024",
    konteks: "Rapat dipimpin oleh Direktur Utama dan dihadiri 12 kepala divisi.",
    file_path: "/mock/UM02-019-2024.pdf",
    file_type: "PDF",
    created_at: "2024-09-11T15:45:00Z",
    tindakan_retensi: null,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const MC_LABELS = {
  KU: 'Keuangan', UM: 'Umum', HK: 'Hukum',
  SDM: 'Sumber Daya Manusia', IT: 'Teknologi Informasi', PR: 'Hubungan Publik',
}

const SIFAT_OPTIONS = ['Biasa', 'Rahasia', 'Terbatas', 'Terbuka']
const MC_OPTIONS = Object.keys(MC_LABELS)

const ADVANCED_FIELDS = [
  { value: 'title', label: 'Judul' },
  { value: 'description', label: 'Deskripsi' },
  { value: 'tentang', label: 'Tentang' },
  { value: 'konteks', label: 'Konteks' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isExpiringSoon(tahun_retensi) {
  const now = new Date()
  const expiry = new Date(tahun_retensi, 11, 31)
  const sixMonths = new Date(now)
  sixMonths.setMonth(sixMonths.getMonth() + 6)
  return expiry <= sixMonths
}

function formatTanggal(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ─── Badge Component ──────────────────────────────────────────────────────────

function SifatBadge({ sifat }) {
  const styles = {
    Rahasia:  { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
    Terbatas: { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
    Biasa:    { bg: '#F8FAFC', color: '#475569', border: '#E2E8F0' },
    Terbuka:  { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' },
  }
  const s = styles[sifat] || styles['Biasa']
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 500,
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      letterSpacing: '0.01em',
    }}>
      {sifat}
    </span>
  )
}

function StatusBadge({ expiring }) {
  if (expiring) {
    return (
      <span style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 500,
        background: '#FFFBEB',
        color: '#92400E',
        border: '1px solid #FDE68A',
      }}>
        Perlu Tindakan
      </span>
    )
  }
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 500,
      background: '#F0FDF4',
      color: '#166534',
      border: '1px solid #BBF7D0',
    }}>
      Aktif
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DaftarDokumenPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [advancedField, setAdvancedField] = useState(null)
  const [filterTahun, setFilterTahun] = useState('')
  const [filterSifat, setFilterSifat] = useState('')
  const [filterMC, setFilterMC] = useState('')
  const [filterSC, setFilterSC] = useState('')
  const [filterRetensi, setFilterRetensi] = useState(false)

  const availableYears = useMemo(() => {
    const years = [...new Set(mockDokumen.map(d => new Date(d.tanggal_dokumen).getFullYear()))]
    return years.sort((a, b) => b - a)
  }, [])

  const availableSCs = useMemo(() => {
    const docs = filterMC ? mockDokumen.filter(d => d.code_MC === filterMC) : mockDokumen
    return [...new Set(docs.map(d => d.code_SC))].sort()
  }, [filterMC])

  const filteredDocs = useMemo(() => {
    return mockDokumen.filter(doc => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        if (advancedField) {
          if (!doc[advancedField]?.toLowerCase().includes(q)) return false
        } else {
          const mcName = MC_LABELS[doc.code_MC] ?? doc.code_MC
          if (!mcName.toLowerCase().includes(q) && !doc.code_MC.toLowerCase().includes(q)) return false
        }
      }
      if (filterTahun && new Date(doc.tanggal_dokumen).getFullYear().toString() !== filterTahun) return false
      if (filterSifat && doc.sifat_dokumen !== filterSifat) return false
      if (filterMC && doc.code_MC !== filterMC) return false
      if (filterSC && doc.code_SC !== filterSC) return false
      if (filterRetensi && !isExpiringSoon(doc.tahun_retensi)) return false
      return true
    })
  }, [searchQuery, advancedField, filterTahun, filterSifat, filterMC, filterSC, filterRetensi])

  const hasFilters = filterTahun || filterSifat || filterMC || filterSC || filterRetensi

  function clearAll() {
    setFilterTahun(''); setFilterSifat(''); setFilterMC('')
    setFilterSC(''); setFilterRetensi(false); setSearchQuery(''); setAdvancedField(null)
  }

  // ── Styles ──────────────────────────────────────────────────────────────────

  const selectStyle = {
    width: '100%',
    fontSize: 13,
    padding: '6px 10px',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    background: '#FFFFFF',
    color: '#374151',
    outline: 'none',
    cursor: 'pointer',
  }

  const thStyle = {
    textAlign: 'left',
    padding: '10px 14px',
    fontSize: 11,
    fontWeight: 600,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid #F1F5F9',
    background: '#F8FAFC',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Page header ─────────────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E8E8E4', padding: '20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}>Daftar Dokumen</h1>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: '2px 0 0' }}>
              {filteredDocs.length} dari {mockDokumen.length} dokumen tersedia
            </p>
          </div>
          <a
            href="/upload"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', background: '#16A34A', color: '#FFFFFF',
              fontSize: 13, fontWeight: 500, borderRadius: 8,
              textDecoration: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Dokumen
          </a>
        </div>
      </div>

      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Search ────────────────────────────────────────────── */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E8E4', borderRadius: 10, padding: 16 }}>
          {/* Input row */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <svg
              style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#9CA3AF' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                advancedField
                  ? `Cari berdasarkan ${ADVANCED_FIELDS.find(f => f.value === advancedField)?.label}…`
                  : 'Cari berdasarkan kategori utama…'
              }
              style={{
                width: '100%', paddingLeft: 34, paddingRight: 36,
                paddingTop: 8, paddingBottom: 8, fontSize: 13,
                border: '1px solid #E2E8F0', borderRadius: 8,
                background: '#F8FAFC', color: '#111827', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 2,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Advanced search radios */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 20px' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Pencarian lanjutan:
            </span>
            {ADVANCED_FIELDS.map(field => (
              <label
                key={field.value}
                style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="advancedField"
                  checked={advancedField === field.value}
                  onChange={() => setAdvancedField(prev => prev === field.value ? null : field.value)}
                  onClick={() => { if (advancedField === field.value) setAdvancedField(null) }}
                  style={{ accentColor: '#16A34A', cursor: 'pointer' }}
                />
                <span style={{ fontSize: 13, color: '#374151' }}>{field.label}</span>
              </label>
            ))}
            {advancedField && (
              <button
                onClick={() => setAdvancedField(null)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── Filters ───────────────────────────────────────────── */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E8E4', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Filter
            </span>
            {hasFilters && (
              <button
                onClick={clearAll}
                style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}
              >
                Hapus semua
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {/* Tahun */}
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#6B7280', marginBottom: 5, fontWeight: 500 }}>Tahun</label>
              <select value={filterTahun} onChange={e => setFilterTahun(e.target.value)} style={selectStyle}>
                <option value="">Semua</option>
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Jenis Arsip */}
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#6B7280', marginBottom: 5, fontWeight: 500 }}>Jenis Arsip</label>
              <select value={filterSifat} onChange={e => setFilterSifat(e.target.value)} style={selectStyle}>
                <option value="">Semua</option>
                {SIFAT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Kategori Utama */}
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#6B7280', marginBottom: 5, fontWeight: 500 }}>Kategori Utama</label>
              <select
                value={filterMC}
                onChange={e => { setFilterMC(e.target.value); setFilterSC('') }}
                style={selectStyle}
              >
                <option value="">Semua</option>
                {MC_OPTIONS.map(mc => <option key={mc} value={mc}>{mc} — {MC_LABELS[mc]}</option>)}
              </select>
            </div>

            {/* Sub-Kategori */}
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#6B7280', marginBottom: 5, fontWeight: 500 }}>Sub-Kategori</label>
              <select
                value={filterSC}
                onChange={e => setFilterSC(e.target.value)}
                style={{ ...selectStyle, opacity: availableSCs.length === 0 ? 0.5 : 1 }}
                disabled={availableSCs.length === 0}
              >
                <option value="">Semua</option>
                {availableSCs.map(sc => <option key={sc} value={sc}>{sc}</option>)}
              </select>
            </div>

            {/* Masa Retensi */}
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#6B7280', marginBottom: 5, fontWeight: 500 }}>Masa Retensi</label>
              <button
                onClick={() => setFilterRetensi(p => !p)}
                style={{
                  width: '100%', fontSize: 13, padding: '6px 10px',
                  border: `1px solid ${filterRetensi ? '#FDE68A' : '#E2E8F0'}`,
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  background: filterRetensi ? '#FFFBEB' : '#FFFFFF',
                  color: filterRetensi ? '#92400E' : '#374151',
                  fontWeight: filterRetensi ? 500 : 400,
                }}
              >
                {filterRetensi ? '⚠ Akan Kadaluarsa' : 'Semua periode'}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
              {filterTahun && <Chip label={`Tahun: ${filterTahun}`} onRemove={() => setFilterTahun('')} />}
              {filterSifat && <Chip label={`Sifat: ${filterSifat}`} onRemove={() => setFilterSifat('')} />}
              {filterMC && <Chip label={`MC: ${filterMC}`} onRemove={() => { setFilterMC(''); setFilterSC('') }} />}
              {filterSC && <Chip label={`SC: ${filterSC}`} onRemove={() => setFilterSC('')} />}
              {filterRetensi && <Chip label="Akan Kadaluarsa" onRemove={() => setFilterRetensi(false)} />}
            </div>
          )}
        </div>

        {/* ── Table ─────────────────────────────────────────────── */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E8E4', borderRadius: 10, overflow: 'hidden' }}>
          {filteredDocs.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', color: '#9CA3AF' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} style={{ marginBottom: 12, opacity: 0.4 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>Tidak ada dokumen ditemukan</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Coba ubah kata kunci atau filter yang aktif</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Judul Dokumen</th>
                    <th style={thStyle}>Nomor / Unit</th>
                    <th style={thStyle}>Tgl. Dokumen</th>
                    <th style={thStyle}>Kategori</th>
                    <th style={thStyle}>Thn. Retensi</th>
                    <th style={thStyle}>Sifat</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc, i) => {
                    const expiring = isExpiringSoon(doc.tahun_retensi)
                    return (
                      <tr
                        key={doc.id}
                        style={{
                          background: expiring ? '#FFFDF5' : (i % 2 === 0 ? '#FFFFFF' : '#FAFAFA'),
                          borderBottom: '1px solid #F1F5F9',
                        }}
                      >
                        {/* Title */}
                        <td style={{ padding: '12px 14px', maxWidth: 260 }}>
                          <p style={{ margin: 0, fontWeight: 500, color: '#111827', fontSize: 13, lineHeight: 1.4,
                            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {doc.title}
                          </p>
                          <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, display: 'block' }}>{doc.file_type}</span>
                        </td>

                        {/* Nomor / Unit */}
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, background: '#F1F5F9', color: '#475569', padding: '3px 7px', borderRadius: 5, display: 'block', marginBottom: 3 }}>
                            {doc.nomor_dokumen}
                          </span>
                          <span style={{ fontSize: 11, color: '#6B7280' }}>{doc.unit_pengolah}</span>
                        </td>

                        {/* Tanggal */}
                        <td style={{ padding: '12px 14px', color: '#374151', whiteSpace: 'nowrap' }}>
                          {formatTanggal(doc.tanggal_dokumen)}
                        </td>

                        {/* Kategori */}
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 600, color: '#111827', display: 'block', fontSize: 12 }}>{doc.code_MC}</span>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{doc.code_SC}</span>
                        </td>

                        {/* Tahun retensi */}
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 500, color: expiring ? '#D97706' : '#374151' }}>
                            {doc.tahun_retensi}
                          </span>
                        </td>

                        {/* Sifat */}
                        <td style={{ padding: '12px 14px' }}>
                          <SifatBadge sifat={doc.sifat_dokumen} />
                        </td>

                        {/* Status */}
                        <td style={{ padding: '12px 14px' }}>
                          <StatusBadge expiring={expiring} />
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <a
                              href={`/documents/${doc.id}`}
                              style={{
                                display: 'inline-flex', alignItems: 'center',
                                padding: '5px 10px', fontSize: 12, fontWeight: 500,
                                color: '#374151', border: '1px solid #E2E8F0',
                                borderRadius: 7, textDecoration: 'none',
                                background: '#FFFFFF', whiteSpace: 'nowrap',
                              }}
                            >
                              Detail
                            </a>

                            {expiring && (
                              <>
                                <button
                                  style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                    padding: '5px 10px', fontSize: 12, fontWeight: 500,
                                    color: '#166534', border: '1px solid #BBF7D0',
                                    borderRadius: 7, cursor: 'pointer',
                                    background: '#F0FDF4', whiteSpace: 'nowrap',
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                  Pertahankan
                                </button>
                                <button
                                  style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                    padding: '5px 10px', fontSize: 12, fontWeight: 500,
                                    color: '#DC2626', border: '1px solid #FECACA',
                                    borderRadius: 7, cursor: 'pointer',
                                    background: '#FEF2F2', whiteSpace: 'nowrap',
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                  </svg>
                                  Musnahkan
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {filteredDocs.length > 0 && (
            <div style={{
              padding: '10px 14px', borderTop: '1px solid #F1F5F9',
              display: 'flex', justifyContent: 'space-between',
              fontSize: 12, color: '#9CA3AF', background: '#FAFAFA',
            }}>
              <span>Menampilkan {filteredDocs.length} dokumen</span>
              <span>
                {mockDokumen.filter(d => isExpiringSoon(d.tahun_retensi)).length} dokumen perlu tindakan retensi
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Chip component ───────────────────────────────────────────────────────────

function Chip({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
      background: '#1F2937', color: '#FFFFFF', cursor: 'default',
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: 14 }}
      >
        ×
      </button>
    </span>
  )
}
