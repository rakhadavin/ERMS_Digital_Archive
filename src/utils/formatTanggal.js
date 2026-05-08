/**
 * formatTanggal.js
 * Utilitas format tanggal dalam Bahasa Indonesia
 * Semua date handling menggunakan ISO 8601 secara internal
 */

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const NAMA_HARI = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu',
]

/**
 * Parse string tanggal atau Date object ke Date yang aman.
 * @param {string|Date} input
 * @returns {Date|null}
 */
function toDate(input) {
  if (!input) return null
  const d = input instanceof Date ? input : new Date(input)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Format tanggal: "12 April 2024"
 * @param {string|Date} tanggal
 * @returns {string}
 */
export function formatTanggalPanjang(tanggal) {
  const d = toDate(tanggal)
  if (!d) return '—'
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Format tanggal pendek: "12 Apr 2024"
 * @param {string|Date} tanggal
 * @returns {string}
 */
export function formatTanggalPendek(tanggal) {
  const d = toDate(tanggal)
  if (!d) return '—'
  const bulanPendek = NAMA_BULAN[d.getMonth()].slice(0, 3)
  return `${d.getDate()} ${bulanPendek} ${d.getFullYear()}`
}

/**
 * Format tanggal + hari: "Jumat, 12 April 2024"
 * @param {string|Date} tanggal
 * @returns {string}
 */
export function formatTanggalDenganHari(tanggal) {
  const d = toDate(tanggal)
  if (!d) return '—'
  return `${NAMA_HARI[d.getDay()]}, ${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Format ke ISO date (YYYY-MM-DD) untuk value input[type=date].
 * @param {string|Date} tanggal
 * @returns {string}
 */
export function toInputDate(tanggal) {
  const d = toDate(tanggal)
  if (!d) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Ambil tahun dari tanggal.
 * @param {string|Date} tanggal
 * @returns {number|null}
 */
export function getTahun(tanggal) {
  const d = toDate(tanggal)
  return d ? d.getFullYear() : null
}

/**
 * Format waktu relatif: "2 hari lalu", "3 bulan lalu", "baru saja"
 * @param {string|Date} tanggal
 * @param {Date} [sekarang]
 * @returns {string}
 */
export function formatWaktuRelatif(tanggal, sekarang = new Date()) {
  const d = toDate(tanggal)
  if (!d) return '—'

  const selisihMs = sekarang.getTime() - d.getTime()
  const selisihMenit = Math.floor(selisihMs / (1000 * 60))
  const selisihJam = Math.floor(selisihMs / (1000 * 60 * 60))
  const selisihHari = Math.floor(selisihMs / (1000 * 60 * 60 * 24))
  const selisihBulan = Math.floor(selisihHari / 30.44)
  const selisihTahun = Math.floor(selisihHari / 365.25)

  if (selisihMenit < 1)   return 'Baru saja'
  if (selisihMenit < 60)  return `${selisihMenit} menit lalu`
  if (selisihJam < 24)    return `${selisihJam} jam lalu`
  if (selisihHari < 30)   return `${selisihHari} hari lalu`
  if (selisihBulan < 12)  return `${selisihBulan} bulan lalu`
  return `${selisihTahun} tahun lalu`
}

/**
 * Format timestamp upload: "15 Jul 2024, 10:30"
 * @param {string|Date} timestamp
 * @returns {string}
 */
export function formatTimestamp(timestamp) {
  const d = toDate(timestamp)
  if (!d) return '—'
  const tanggal = formatTanggalPendek(d)
  const jam = String(d.getHours()).padStart(2, '0')
  const menit = String(d.getMinutes()).padStart(2, '0')
  return `${tanggal}, ${jam}:${menit}`
}

/**
 * Ambil daftar tahun unik dari array dokumen (untuk filter).
 * @param {Array<{tanggal_dokumen: string}>} dokumenList
 * @returns {number[]} Tahun diurutkan descending
 */
export function getTahunUnik(dokumenList) {
  const tahunSet = new Set(
    dokumenList
      .map((d) => getTahun(d.tanggal_dokumen))
      .filter(Boolean)
  )
  return [...tahunSet].sort((a, b) => b - a)
}
