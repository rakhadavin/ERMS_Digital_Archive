/**
 * parseNomorDokumen.js
 * Utilitas untuk memecah dan memvalidasi format nomor dokumen
 *
 * Format standar: "NNN/KK.SS/RB/TTTT"
 *   NNN  = nomor urut            contoh: 001, 024, 017
 *   KK   = kode kategori utama   contoh: KU, HK, SDM, UM, IT, PR
 *   SS   = kode sub-kategori     contoh: 01, 02, 03
 *   RB   = bulan romawi          contoh: I, IV, VII, XII
 *   TTTT = tahun 4 digit         contoh: 2024
 *
 * Contoh valid:
 *   "001/KU.01/IV/2024"   -> kode: "KU.01"
 *   "024/SDM.02/VII/2024" -> kode: "SDM.02"
 *   "007/UM.04/II/2024"   -> kode: "UM.04"
 */

const BULAN_ROMAWI = {
  I: 1, II: 2, III: 3, IV: 4,
  V: 5, VI: 6, VII: 7, VIII: 8,
  IX: 9, X: 10, XI: 11, XII: 12,
}

/**
 * Ekstrak kode klasifikasi (code_SC) dari nomor dokumen.
 * @param {string} nomorDokumen
 * @returns {{ success: boolean, kode: string|null, error: string|null }}
 */
export function parseKodeKlasifikasi(nomorDokumen) {
  if (!nomorDokumen || typeof nomorDokumen !== 'string') {
    return { success: false, kode: null, error: 'Nomor dokumen tidak boleh kosong' }
  }

  const parts = nomorDokumen.trim().split('/')

  if (parts.length !== 4) {
    return {
      success: false,
      kode: null,
      error: `Format tidak valid. Harus 4 bagian dipisah "/", ditemukan ${parts.length} bagian`,
    }
  }

  const [nomorUrut, kodeKlasifikasi, bulanRomawi, tahun] = parts

  if (!/^\d+$/.test(nomorUrut)) {
    return { success: false, kode: null, error: `Nomor urut harus angka, ditemukan: "${nomorUrut}"` }
  }

  if (!/^[A-Z]+\.\d+$/.test(kodeKlasifikasi)) {
    return { success: false, kode: null, error: `Kode klasifikasi tidak valid, harus format "XX.NN", ditemukan: "${kodeKlasifikasi}"` }
  }

  if (!(bulanRomawi in BULAN_ROMAWI)) {
    return { success: false, kode: null, error: `Bulan romawi tidak dikenali: "${bulanRomawi}"` }
  }

  const tahunNum = parseInt(tahun, 10)
  if (!/^\d{4}$/.test(tahun) || tahunNum < 1900 || tahunNum > 2100) {
    return { success: false, kode: null, error: `Tahun tidak valid: "${tahun}"` }
  }

  return { success: true, kode: kodeKlasifikasi, error: null }
}

/**
 * Pecah nomor dokumen menjadi semua komponennya.
 * @param {string} nomorDokumen
 * @returns {{ success: boolean, data: object|null, error: string|null }}
 */
export function parseNomorDokumen(nomorDokumen) {
  const hasil = parseKodeKlasifikasi(nomorDokumen)
  if (!hasil.success) return { success: false, data: null, error: hasil.error }

  const parts = nomorDokumen.trim().split('/')
  const [nomorUrut, kodeKlasifikasi, bulanRomawi, tahun] = parts
  const [kodeMC, kodeSCNum] = kodeKlasifikasi.split('.')

  return {
    success: true,
    error: null,
    data: {
      nomorUrut: nomorUrut.padStart(3, '0'),
      kodeKlasifikasi,
      kodeMC,
      kodeSC: kodeKlasifikasi,
      bulanRomawi,
      bulan: BULAN_ROMAWI[bulanRomawi],
      tahun: parseInt(tahun, 10),
    },
  }
}

/**
 * Validasi cepat: apakah string adalah nomor dokumen valid?
 * @param {string} nomorDokumen
 * @returns {boolean}
 */
export function isNomorDokumenValid(nomorDokumen) {
  return parseKodeKlasifikasi(nomorDokumen).success
}

/**
 * Format nomor urut dengan padding nol.
 * @param {number} nomor
 * @param {number} panjang - default 3
 * @returns {string}
 * @example formatNomorUrut(7) // "007"
 */
export function formatNomorUrut(nomor, panjang = 3) {
  return String(nomor).padStart(panjang, '0')
}

/**
 * Konversi angka bulan ke romawi.
 * @param {number} bulan - 1 sampai 12
 * @returns {string}
 */
export function toBulanRomawi(bulan) {
  const entry = Object.entries(BULAN_ROMAWI).find(([, v]) => v === bulan)
  return entry ? entry[0] : ''
}

/**
 * Buat nomor dokumen dari komponen-komponennya.
 * @param {{ nomorUrut: number, kodeSC: string, bulan: number, tahun: number }} params
 * @returns {string}
 * @example buatNomorDokumen({ nomorUrut: 5, kodeSC: 'KU.01', bulan: 4, tahun: 2024 }) // "005/KU.01/IV/2024"
 */
export function buatNomorDokumen({ nomorUrut, kodeSC, bulan, tahun }) {
  return [formatNomorUrut(nomorUrut), kodeSC, toBulanRomawi(bulan), tahun].join('/')
}
