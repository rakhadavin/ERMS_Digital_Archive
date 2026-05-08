/**
 * mockKategori.js
 * Data mock untuk MAIN_CATEGORY dan SUB_CATEGORIES
 * Nanti diganti dengan API call ke backend
 */

export const mainCategories = [
  {
    code_MC: 'KU',
    name_MC: 'Keuangan',
    desc_MC: 'Arsip yang berkaitan dengan pengelolaan keuangan, anggaran, pembukuan, dan laporan keuangan organisasi.',
  },
  {
    code_MC: 'HK',
    name_MC: 'Hukum & Peraturan',
    desc_MC: 'Arsip peraturan, kebijakan, kontrak, perjanjian kerja sama, dan dokumen hukum lainnya.',
  },
  {
    code_MC: 'SDM',
    name_MC: 'Sumber Daya Manusia',
    desc_MC: 'Arsip kepegawaian, rekrutmen, pelatihan, evaluasi kinerja, dan administrasi SDM.',
  },
  {
    code_MC: 'UM',
    name_MC: 'Umum & Administrasi',
    desc_MC: 'Arsip surat menyurat umum, pengadaan barang/jasa, pengelolaan aset, dan administrasi perkantoran.',
  },
  {
    code_MC: 'IT',
    name_MC: 'Teknologi Informasi',
    desc_MC: 'Arsip sistem informasi, infrastruktur TI, keamanan data, dan pengembangan aplikasi.',
  },
  {
    code_MC: 'PR',
    name_MC: 'Hubungan Publik',
    desc_MC: 'Arsip komunikasi eksternal, publikasi, kehumasan, dan dokumentasi kegiatan publik.',
  },
]

export const subCategories = [
  // ── Keuangan ──────────────────────────────────────
  {
    code_MC: "KU",
    code_SC: "KU.01",
    name_SC: "Pengadaan Barang & Jasa",
    desc_SC: "Dokumen proses pengadaan, tender, kontrak pembelian, dan berita acara serah terima barang/jasa.",
    retention: 10,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 5,
    keterangan: "Dimusnahkan",
  },
  {
    code_MC: "KU",
    code_SC: "KU.02",
    name_SC: "Audit & Pemeriksaan",
    desc_SC: "Laporan audit internal/eksternal, temuan pemeriksaan, tindak lanjut hasil audit.",
    retention: 10,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 5,
    keterangan: "Dimusnahkan",
  },
  {
    code_MC: "KU",
    code_SC: "KU.03",
    name_SC: "Anggaran & RKAT",
    desc_SC: "Dokumen perencanaan anggaran, revisi anggaran, laporan realisasi anggaran.",
    retention: 10,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 5,
    keterangan: "Dimusnahkan",
  },
  {
    code_MC: "KU",
    code_SC: "KU.04",
    name_SC: "Laporan Keuangan",
    desc_SC: "Neraca, laporan laba rugi, arus kas, dan laporan keuangan periodik lainnya.",
    retention: 10,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 5,
    keterangan: "Dimusnahkan",
  },
  {
    code_MC: "KU",
    code_SC: "KU.05",
    name_SC: "Perpajakan",
    desc_SC: "SPT, bukti potong, faktur pajak, dan dokumen perpajakan lainnya.",
    retention: 5,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 0,
    keterangan: "Permanen",
  },

  // ── Hukum & Peraturan ─────────────────────────────
  {
    code_MC: "HK",
    code_SC: "HK.01",
    name_SC: "Surat Keputusan & Peraturan",
    desc_SC: "SK Direksi, Peraturan Direktur, kebijakan internal yang bersifat mengikat.",
    retention: 30,
    masa_retensi_aktif: 6,
    masa_retensi_inaktif: 2,
    keterangan: "Permanen",
  },
  {
    code_MC: "HK",
    code_SC: "HK.02",
    name_SC: "Kontrak & Perjanjian",
    desc_SC: "MoU, PKS, kontrak kerja sama dengan pihak ketiga, dan addendum.",
    retention: 10,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 5,
    keterangan: "Dimusnahkan",
  },
  {
    code_MC: "HK",
    code_SC: "HK.03",
    name_SC: "Perizinan & Legalitas",
    desc_MC: "Izin usaha, sertifikat, akta pendirian, dan dokumen legalitas organisasi.",
    retention: 30,
    masa_retensi_aktif: 6,
    masa_retensi_inaktif: 2,
    keterangan: "Permanen",
  },

  // ── SDM ───────────────────────────────────────────
  {
    code_MC: "SDM",
    code_SC: "SDM.01",
    name_SC: "Rekrutmen & Seleksi",
    desc_SC: "Pengumuman lowongan, berkas lamaran, hasil seleksi, dan SK pengangkatan.",
    retention: 5,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 0,
    keterangan: "Permanen",
  },
  {
    code_MC: "SDM",
    code_SC: "SDM.02",
    name_SC: "Evaluasi Kinerja",
    desc_SC: "Formulir penilaian kinerja, laporan evaluasi, dan rekomendasi pengembangan.",
    retention: 5,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 0,
    keterangan: "Permanen",
  },
  {
    code_MC: "SDM",
    code_SC: "SDM.03",
    name_SC: "Pelatihan & Pengembangan",
    desc_SC: "Dokumen diklat, sertifikat pelatihan, laporan pelaksanaan pelatihan.",
    retention: 5,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 0,
    keterangan: "Permanen",
  },
  {
    code_MC: "SDM",
    code_SC: "SDM.04",
    name_SC: "Data Kepegawaian",
    desc_SC: "File 201 pegawai, riwayat jabatan, SK mutasi/promosi, dan pensiun.",
    retention: 75,
  },

  // ── Umum ──────────────────────────────────────────
  {
    code_MC: "UM",
    code_SC: "UM.01",
    name_SC: "Surat Menyurat Umum",
    desc_SC: "Surat masuk dan keluar yang bersifat umum dan tidak masuk kategori khusus.",
    retention: 5,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 0,
    keterangan: "Permanen",
  },
  {
    code_MC: "UM",
    code_SC: "UM.02",
    name_SC: "Rapat & Notulen",
    desc_SC: "Undangan rapat, daftar hadir, notulensi, dan risalah rapat.",
    retention: 5,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 0,
    keterangan: "Permanen",
  },
  {
    code_MC: "UM",
    code_SC: "UM.03",
    name_SC: "Pengelolaan Aset",
    desc_SC: "Kartu inventaris, daftar aset, berita acara penghapusan aset.",
    retention: 10,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 5,
    keterangan: "Dimusnahkan",
  },
  {
    code_MC: "UM",
    code_SC: "UM.04",
    name_SC: "Berita Acara",
    desc_SC: "Berita acara serah terima, pemeriksaan, dan kegiatan resmi lainnya.",
    retention: 5,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 0,
    keterangan: "Permanen",
  },

  // ── IT ────────────────────────────────────────────
  {
    code_MC: "IT",
    code_SC: "IT.01",
    name_SC: "Infrastruktur & Jaringan",
    desc_SC: "Dokumentasi arsitektur sistem, topologi jaringan, spesifikasi server.",
    retention: 10,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 5,
    keterangan: "Dimusnahkan",
  },
  {
    code_MC: "IT",
    code_SC: "IT.02",
    name_SC: "Keamanan Informasi",
    desc_SC: "Kebijakan keamanan data, laporan insiden siber, audit keamanan sistem.",
    retention: 10,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 5,
    keterangan: "Dimusnahkan",
  },
  {
    code_MC: "IT",
    code_SC: "IT.03",
    name_SC: "Pengembangan Aplikasi",
    desc_SC: "Spesifikasi kebutuhan, dokumen desain sistem, panduan pengguna aplikasi.",
    retention: 10,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 5,
    keterangan: "Dimusnahkan",
  },

  // ── PR ────────────────────────────────────────────
  {
    code_MC: "PR",
    code_SC: "PR.01",
    name_SC: "Siaran Pers & Publikasi",
    desc_SC: "Press release, brosur, laporan tahunan publik, dan materi komunikasi eksternal.",
    retention: 10,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 5,
    keterangan: "Dimusnahkan",
  },
  {
    code_MC: "PR",
    code_SC: "PR.02",
    name_SC: "Dokumentasi Kegiatan",
    desc_SC: "Foto, video, dan laporan kegiatan acara resmi organisasi.",
    retention: 10,
    masa_retensi_aktif: 5,
    masa_retensi_inaktif: 5,
    keterangan: "Dimusnahkan",
  },
];

/**
 * Helper: ambil sub-kategori berdasarkan code_MC
 */
export function getSubByMC(code_MC) {
  return subCategories.filter((sc) => sc.code_MC === code_MC)
}

/**
 * Helper: cari sub-kategori berdasarkan code_SC
 */
export function getSubBySC(code_SC) {
  return subCategories.find((sc) => sc.code_SC === code_SC) || null
}

/**
 * Helper: cari main category berdasarkan code_MC
 */
export function getMainByMC(code_MC) {
  return mainCategories.find((mc) => mc.code_MC === code_MC) || null
}
