// ─── Mock Data: Kategori Utama ───────────────────────────────────────────────
export const mockKategoriUtama = [
  { code_MC: "MR", name_MC: "Moneter", desc_MC: "Dokumen terkait kebijakan moneter, pengelolaan moneter, dan cadangan devisa." },
  { code_MC: "MP", name_MC: "Makroprudensial", desc_MC: "Dokumen terkait kebijakan makroprudensial dan surveillance sistem keuangan." },
];

// ─── Mock Data: Sub Kategori ─────────────────────────────────────────────────
export const mockSubKategori = [
  // ── MR — Moneter ──────────────────────────────────────────────────────────
  { code_MC: "MR", code_SC: "MR.01", name_SC: "Ekonomi Moneter", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MR", code_SC: "MR.01.01", name_SC: "Kebijakan", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MR", code_SC: "MR.01.01.01", name_SC: "Kebijakan Moneter", desc_SC: null, masa_retensi_aktif: 5, masa_retensi_inaktif: 25, keterangan: "Simpan Permanen" },
  { code_MC: "MR", code_SC: "MR.01.02", name_SC: "Penelitian dan Analisa", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MR", code_SC: "MR.01.02.01", name_SC: "Kertas Penelitian dan Analisa", desc_SC: null, masa_retensi_aktif: 2, masa_retensi_inaktif: 3, keterangan: "Musnah" },
  { code_MC: "MR", code_SC: "MR.01.02.05", name_SC: "Working Paper", desc_SC: null, masa_retensi_aktif: 2, masa_retensi_inaktif: 3, keterangan: "Musnah" },
  { code_MC: "MR", code_SC: "MR.01.03", name_SC: "Pidato dan Pernyataan Resmi", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MR", code_SC: "MR.01.03.02", name_SC: "Naskah Pidato Pimpinan", desc_SC: null, masa_retensi_aktif: 5, masa_retensi_inaktif: 20, keterangan: "Simpan Permanen" },
  { code_MC: "MR", code_SC: "MR.02", name_SC: "Pengelolaan Moneter", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MR", code_SC: "MR.02.02", name_SC: "Instrumen Moneter", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MR", code_SC: "MR.02.02.01", name_SC: "Berkas Kebijakan Instrumen Moneter", desc_SC: null, masa_retensi_aktif: 5, masa_retensi_inaktif: 5, keterangan: "Musnah" },
  { code_MC: "MR", code_SC: "MR.03", name_SC: "Pengelolaan Cadangan Devisa", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MR", code_SC: "MR.03.01", name_SC: "Kebijakan Cadangan Devisa", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MR", code_SC: "MR.03.01.01", name_SC: "Kebijakan Pengelolaan Cadangan Devisa", desc_SC: null, masa_retensi_aktif: 5, masa_retensi_inaktif: 25, keterangan: "Simpan Permanen" },

  // ── MP — Makroprudensial ───────────────────────────────────────────────────
  { code_MC: "MP", code_SC: "MP.01", name_SC: "Kebijakan Makroprudensial", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MP", code_SC: "MP.01.01", name_SC: "Kebijakan", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MP", code_SC: "MP.01.01.01", name_SC: "Kebijakan Makroprudensial", desc_SC: null, masa_retensi_aktif: 5, masa_retensi_inaktif: 25, keterangan: "Simpan Permanen" },
  { code_MC: "MP", code_SC: "MP.01.02", name_SC: "Asesmen Stabilitas Sistem Keuangan", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  {
    code_MC: "MP",
    code_SC: "MP.01.02.01",
    name_SC: "Laporan Hasil Asesmen Stabilitas Sistem Keuangan",
    desc_SC: null,
    masa_retensi_aktif: 10,
    masa_retensi_inaktif: 20,
    keterangan: "Simpan Permanen",
  },
  { code_MC: "MP", code_SC: "MP.01.02.06", name_SC: "Laporan Pengawasan Bank Sistemik", desc_SC: null, masa_retensi_aktif: 5, masa_retensi_inaktif: 5, keterangan: "Musnah" },
  { code_MC: "MP", code_SC: "MP.01.06", name_SC: "Protokol Manajemen Krisis", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MP", code_SC: "MP.01.06.01", name_SC: "Berkas Protokol Manajemen Krisis", desc_SC: null, masa_retensi_aktif: 5, masa_retensi_inaktif: 5, keterangan: "Musnah" },
  { code_MC: "MP", code_SC: "MP.02", name_SC: "Surveillance Sistem Keuangan", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MP", code_SC: "MP.02.01", name_SC: "Kebijakan Surveillance", desc_SC: null, masa_retensi_aktif: null, masa_retensi_inaktif: null, keterangan: null },
  { code_MC: "MP", code_SC: "MP.02.01.01", name_SC: "Kebijakan Surveillance Sistem Keuangan", desc_SC: null, masa_retensi_aktif: 5, masa_retensi_inaktif: 25, keterangan: "Simpan Permanen" },
];
