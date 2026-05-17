import { mockDokumen } from '../data/mockData.js'

const CURRENT_YEAR = 2026

const MC_KEYWORDS = [
  {
    words: ['moneter', 'kebijakan moneter', 'devisa', 'cadangan devisa', 'inflasi', 'suku bunga', 'operasi pasar terbuka', 'operasi pasar'],
    code: 'MR', name: 'Moneter',
  },
  {
    words: ['makroprudensial', 'stabilitas sistem keuangan', 'stabilitas keuangan', 'bank sistemik', 'surveillance', 'manajemen krisis', 'pengawasan bank'],
    code: 'MP', name: 'Makroprudensial',
  },
]

const SC_KEYWORDS = [
  { words: ['kertas penelitian', 'penelitian analisa', 'analisa moneter', 'riset moneter'], prefix: 'MR.01.02', name: 'Penelitian dan Analisa' },
  { words: ['working paper'], code: 'MR.01.02.05', name: 'Working Paper' },
  { words: ['naskah pidato', 'pidato gubernur', 'pidato pimpinan', 'pidato'], code: 'MR.01.03.02', name: 'Naskah Pidato Pimpinan' },
  { words: ['instrumen moneter'], code: 'MR.02.02.01', name: 'Instrumen Moneter' },
  { words: ['posisi cadangan devisa', 'laporan cadangan devisa'], code: 'MR.03.02', name: 'Posisi Cadangan Devisa' },
  { words: ['asesmen stabilitas', 'laporan stabilitas', 'laporan asesmen'], prefix: 'MP.01.02', name: 'Asesmen Stabilitas' },
  { words: ['pengawasan bank sistemik', 'laporan pengawasan bank'], code: 'MP.01.02.06', name: 'Pengawasan Bank Sistemik' },
  { words: ['protokol manajemen krisis', 'manajemen krisis', 'protokol krisis'], prefix: 'MP.01.06', name: 'Protokol Manajemen Krisis' },
  { words: ['kebijakan surveillance', 'surveillance sistem keuangan', 'surveillance keuangan'], prefix: 'MP.02', name: 'Surveillance Sistem Keuangan' },
]

const SIFAT_KEYWORDS = [
  { words: ['rahasia'], value: 'Rahasia' },
  { words: ['terbatas'], value: 'Terbatas' },
  { words: ['terbuka'], value: 'Terbuka' },
  { words: ['biasa', 'umum', 'tidak rahasia'], value: 'Biasa' },
]

const UNIT_KEYWORDS = [
  { words: ['departemen moneter', 'dept moneter', 'unit moneter'], value: 'Departemen Moneter' },
  { words: ['departemen makroprudensial', 'dept makroprudensial', 'unit makroprudensial'], value: 'Departemen Makroprudensial' },
]

const RETENTION_KEYWORDS = ['retensi', 'expired', 'mau habis', 'hampir habis', 'akan berakhir', 'segera berakhir', 'kadaluarsa', 'habis masa']
const SHOW_ALL_KEYWORDS = ['semua dokumen', 'semua arsip', 'tampilkan semua', 'lihat semua', 'daftar semua']
const GREETINGS = ['halo', 'hai', 'hello', 'hi', 'hei', 'selamat pagi', 'selamat siang', 'selamat sore', 'assalamu', 'permisi']

function matchFirst(q, list) {
  for (const entry of list) {
    for (const word of entry.words) {
      if (q.includes(word)) return entry
    }
  }
  return null
}

function extractYear(q) {
  const m = q.match(/\b(20\d{2})\b/)
  return m ? parseInt(m[1]) : null
}

function parseQuery(raw) {
  const q = raw.toLowerCase().trim()
  const f = {}

  const sc = matchFirst(q, SC_KEYWORDS)
  if (sc) {
    if (sc.code) f.code_SC = sc.code
    else f.sc_prefix = sc.prefix
    f._sc_name = sc.name
  }

  const mc = matchFirst(q, MC_KEYWORDS)
  if (mc) { f.code_MC = mc.code; f._mc_name = mc.name }

  const sifat = matchFirst(q, SIFAT_KEYWORDS)
  if (sifat) f.sifat = sifat.value

  const unit = matchFirst(q, UNIT_KEYWORDS)
  if (unit) f.unit = unit.value

  const year = extractYear(q)
  if (year) f.year = year

  if (RETENTION_KEYWORDS.some(w => q.includes(w))) f.retention_soon = true
  if (SHOW_ALL_KEYWORDS.some(w => q.includes(w))) f.show_all = true

  return f
}

function applyFilters(f) {
  if (f.show_all) return [...mockDokumen]
  let docs = [...mockDokumen]

  if (f.code_SC) docs = docs.filter(d => d.sc === f.code_SC)
  else if (f.sc_prefix) docs = docs.filter(d => d.sc.startsWith(f.sc_prefix))

  if (f.code_MC) docs = docs.filter(d => d.mc === f.code_MC)
  if (f.sifat) docs = docs.filter(d => d.sifat === f.sifat)
  if (f.unit) docs = docs.filter(d => d.unit === f.unit)
  if (f.year) docs = docs.filter(d => new Date(d.tanggal).getFullYear() === f.year)
  if (f.retention_soon) docs = docs.filter(d => d.retensi <= CURRENT_YEAR + 1)

  return docs
}

function buildResponse(f, results, raw) {
  const q = raw.toLowerCase().trim()
  const isGreeting = GREETINGS.some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + ','))
  const hasFilters = Object.keys(f).filter(k => !k.startsWith('_')).length > 0

  if (isGreeting && !hasFilters) {
    return {
      intent: 'greeting',
      text: 'Halo! Saya asisten pencarian arsip **MetaLexicon**.\n\nContoh query:\n• "dokumen moneter rahasia 2024"\n• "working paper tahun 2024"\n• "arsip yang mau habis retensi"\n• "semua dokumen makroprudensial"',
      docs: [],
    }
  }

  if (!hasFilters) {
    return {
      intent: 'unclear',
      text: 'Saya belum mengenali query tersebut. Coba gunakan kata kunci seperti:\n• Kategori: "moneter", "makroprudensial"\n• Sifat: "rahasia", "terbatas"\n• Tahun: "2024"\n• Retensi: "mau habis retensi"',
      docs: [],
    }
  }

  if (f.show_all) {
    return { intent: 'found', text: `Menampilkan semua **${results.length} dokumen** dalam arsip.`, docs: results }
  }

  if (results.length === 0) {
    if (f.code_SC || f.sc_prefix) {
      const relaxed = { ...f }
      delete relaxed.code_SC
      delete relaxed.sc_prefix
      const partial = applyFilters(relaxed)
      if (partial.length > 0) {
        return {
          intent: 'partial',
          text: `Tidak ditemukan dokumen spesifik untuk "${f._sc_name}". Menampilkan **${partial.length} dokumen** dari kategori ${f._mc_name || 'terkait'}.`,
          docs: partial,
        }
      }
    }
    return {
      intent: 'empty',
      text: 'Tidak ditemukan dokumen yang sesuai. Coba kata kunci yang berbeda atau gunakan filter manual di halaman **Daftar Dokumen**.',
      docs: [],
    }
  }

  const parts = []
  if (f._sc_name) parts.push(`sub-kategori **${f._sc_name}**`)
  else if (f._mc_name) parts.push(`kategori **${f._mc_name}**`)
  if (f.year) parts.push(`tahun ${f.year}`)
  if (f.sifat) parts.push(`sifat **${f.sifat}**`)
  if (f.unit) parts.push(`dari ${f.unit}`)
  if (f.retention_soon) parts.push('**mendekati batas retensi**')

  const ctx = parts.length ? ` untuk ${parts.join(', ')}` : ''
  return {
    intent: 'found',
    text: `Ditemukan **${results.length} dokumen**${ctx}.`,
    docs: results,
  }
}

export function simulateChatbot(rawQuery) {
  const filters = parseQuery(rawQuery)
  const results = applyFilters(filters)
  return buildResponse(filters, results, rawQuery)
}
