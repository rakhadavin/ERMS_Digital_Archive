/**
 * hitungRetensi.js
 * Utilitas kalkulasi dan logika retensi dokumen
 *
 * Aturan bisnis utama:
 *   tahun_retensi = tahun(tanggal_dokumen) + retention
 *   Dokumen "kritis" jika: tahun_retensi - tahun_sekarang <= 0.5 (6 bulan)
 */

/**
 * Hitung tahun retensi dokumen.
 *
 * @param {string|Date} tanggalDokumen - Tanggal dokumen (ISO string atau Date)
 * @param {number} retention - Masa retensi dalam tahun (dari sub-kategori)
 * @returns {number} Tahun retensi, contoh: 2034
 *
 * @example
 * hitungTahunRetensi('2024-04-12', 10) // -> 2034
 */
export function hitungTahunRetensi(tanggalDokumen, retention) {
  const tanggal = tanggalDokumen instanceof Date
    ? tanggalDokumen
    : new Date(tanggalDokumen)

  if (isNaN(tanggal.getTime())) {
    throw new Error(`Tanggal dokumen tidak valid: "${tanggalDokumen}"`)
  }

  return tanggal.getFullYear() + retention
}

/**
 * Hitung sisa waktu (dalam bulan) hingga retensi kadaluarsa.
 * Nilai negatif = sudah kadaluarsa.
 *
 * @param {number} tahunRetensi
 * @param {Date} [sekarang] - Opsional, default: new Date()
 * @returns {number} Sisa bulan (bisa desimal)
 *
 * @example
 * hitungSisaBulan(2024) // -> sekitar 7 jika sekarang Mei 2024
 */
export function hitungSisaBulan(tahunRetensi, sekarang = new Date()) {
  const tglKadaluarsa = new Date(tahunRetensi, 11, 31) // 31 Desember tahun retensi
  const selisihMs = tglKadaluarsa.getTime() - sekarang.getTime()
  const selisihBulan = selisihMs / (1000 * 60 * 60 * 24 * 30.44)
  return Math.round(selisihBulan * 10) / 10 // bulatkan 1 desimal
}

/**
 * Cek apakah dokumen berada dalam zona kritis retensi (<= 6 bulan).
 *
 * @param {number} tahunRetensi
 * @param {Date} [sekarang]
 * @returns {boolean}
 */
export function isRetensiKritis(tahunRetensi, sekarang = new Date()) {
  const sisaBulan = hitungSisaBulan(tahunRetensi, sekarang)
  return sisaBulan >= 0 && sisaBulan <= 6
}

/**
 * Cek apakah dokumen sudah melewati batas retensi.
 *
 * @param {number} tahunRetensi
 * @param {Date} [sekarang]
 * @returns {boolean}
 */
export function isRetensiKadaluarsa(tahunRetensi, sekarang = new Date()) {
  return hitungSisaBulan(tahunRetensi, sekarang) < 0
}

/**
 * Kategorikan urgensi retensi sebuah dokumen.
 *
 * @param {number} tahunRetensi
 * @param {Date} [sekarang]
 * @returns {'kadaluarsa' | 'kritis' | 'segera' | 'aman'}
 *   - kadaluarsa : sudah melewati tahun retensi
 *   - kritis     : sisa <= 2 bulan
 *   - segera     : sisa 3-6 bulan
 *   - aman       : sisa > 6 bulan
 */
export function getUrgensiRetensi(tahunRetensi, sekarang = new Date()) {
  const sisa = hitungSisaBulan(tahunRetensi, sekarang)
  if (sisa < 0)  return 'kadaluarsa'
  if (sisa <= 2) return 'kritis'
  if (sisa <= 6) return 'segera'
  return 'aman'
}

/**
 * Ambil warna (CSS color string) berdasarkan urgensi retensi.
 * Digunakan untuk urgency bar, badge, dan indikator di UI.
 *
 * @param {'kadaluarsa'|'kritis'|'segera'|'aman'} urgensi
 * @returns {{ bg: string, text: string, border: string }}
 */
export function getWarnaBadgeRetensi(urgensi) {
  const peta = {
    kadaluarsa: { bg: '#FCEBEB', text: '#A32D2D', border: '#F7C1C1' },
    kritis:     { bg: '#FCEBEB', text: '#A32D2D', border: '#F7C1C1' },
    segera:     { bg: '#FAEEDA', text: '#854F0B', border: '#FAC775' },
    aman:       { bg: '#E1F5EE', text: '#0F6E56', border: '#9FE1CB' },
  }
  return peta[urgensi] ?? peta['aman']
}

/**
 * Label teks urgensi dalam Bahasa Indonesia.
 *
 * @param {'kadaluarsa'|'kritis'|'segera'|'aman'} urgensi
 * @returns {string}
 */
export function getLabelUrgensi(urgensi) {
  const peta = {
    kadaluarsa: 'Kadaluarsa',
    kritis:     'Sangat Kritis',
    segera:     'Segera Ditangani',
    aman:       'Aman',
  }
  return peta[urgensi] ?? 'Tidak Diketahui'
}

/**
 * Format sisa waktu retensi menjadi string yang ramah dibaca.
 *
 * @param {number} tahunRetensi
 * @param {Date} [sekarang]
 * @returns {string}
 *
 * @example
 * formatSisaRetensi(2024) // -> "2 bulan lagi" atau "Sudah kadaluarsa"
 */
export function formatSisaRetensi(tahunRetensi, sekarang = new Date()) {
  const sisa = hitungSisaBulan(tahunRetensi, sekarang)

  if (sisa < 0) {
    const lewat = Math.abs(Math.round(sisa))
    return `Kadaluarsa ${lewat} bulan lalu`
  }

  const sisaBulat = Math.round(sisa)
  if (sisaBulat === 0) return 'Kadaluarsa bulan ini'
  if (sisaBulat === 1) return '1 bulan lagi'
  if (sisaBulat < 12) return `${sisaBulat} bulan lagi`

  const tahun = Math.floor(sisaBulat / 12)
  const bulan = sisaBulat % 12
  if (bulan === 0) return `${tahun} tahun lagi`
  return `${tahun} tahun ${bulan} bulan lagi`
}

/**
 * Hitung persentase urgency bar (0-100).
 * 100% = sudah kadaluarsa, 0% = masih 6 bulan penuh.
 *
 * @param {number} sisaBulan - dari hitungSisaBulan()
 * @param {number} maksimumBulan - default 6 (window notifikasi)
 * @returns {number} 0-100
 */
export function hitungPersenUrgensi(sisaBulan, maksimumBulan = 6) {
  if (sisaBulan <= 0) return 100
  const persen = ((maksimumBulan - sisaBulan) / maksimumBulan) * 100
  return Math.min(100, Math.max(0, Math.round(persen)))
}

/**
 * Filter daftar dokumen berdasarkan kondisi retensi.
 *
 * @param {Array} dokumenList - Array dokumen dengan field tahun_retensi
 * @param {'semua'|'kritis'|'segera'|'aman'|'kadaluarsa'} filter
 * @param {Date} [sekarang]
 * @returns {Array}
 */
export function filterDokumenByRetensi(dokumenList, filter, sekarang = new Date()) {
  if (filter === 'semua') return dokumenList

  return dokumenList.filter((doc) => {
    const urgensi = getUrgensiRetensi(doc.tahun_retensi, sekarang)
    if (filter === 'kritis') return urgensi === 'kritis' || urgensi === 'kadaluarsa'
    return urgensi === filter
  })
}

/**
 * Urutkan daftar dokumen dari yang paling mendesak retensinya.
 *
 * @param {Array} dokumenList
 * @param {Date} [sekarang]
 * @returns {Array} Salinan array yang sudah diurutkan (tidak mutasi aslinya)
 */
export function urutkanByRetensi(dokumenList, sekarang = new Date()) {
  return [...dokumenList].sort((a, b) => {
    const sisaA = hitungSisaBulan(a.tahun_retensi, sekarang)
    const sisaB = hitungSisaBulan(b.tahun_retensi, sekarang)
    return sisaA - sisaB
  })
}
