// ─── Mock Data: Kategori ─────────────────────────────────────────────────────

export const mockKategoriUtama = [
  { code_MC: 'KU', name_MC: 'Keuangan', desc_MC: 'Dokumen terkait keuangan, anggaran, dan pengadaan.' },
  { code_MC: 'HK', name_MC: 'Hukum', desc_MC: 'Kontrak, perjanjian, keputusan hukum.' },
  { code_MC: 'UM', name_MC: 'Umum', desc_MC: 'Kegiatan operasional dan administrasi umum.' },
  { code_MC: 'SDM', name_MC: 'Sumber Daya Manusia', desc_MC: 'Rekrutmen, penilaian kinerja, kepegawaian.' },
]

export const mockSubKategori = [
  { code_MC: 'KU', code_SC: 'KU.01', name_SC: 'Pengadaan Barang', desc_SC: 'Dokumen proses pengadaan barang dan jasa.', retention: 5 },
  { code_MC: 'KU', code_SC: 'KU.02', name_SC: 'Audit Internal', desc_SC: 'Laporan audit internal tahunan dan kuartalan.', retention: 10 },
  { code_MC: 'KU', code_SC: 'KU.03', name_SC: 'Anggaran', desc_SC: 'Nota dinas dan dokumen anggaran tahunan.', retention: 7 },
  { code_MC: 'HK', code_SC: 'HK.01', name_SC: 'Keputusan Internal', desc_SC: 'SK pembentukan tim, penetapan jabatan.', retention: 10 },
  { code_MC: 'HK', code_SC: 'HK.02', name_SC: 'Kontrak Kerja Sama', desc_SC: 'Perjanjian dengan pihak ketiga dan vendor.', retention: 10 },
  { code_MC: 'UM', code_SC: 'UM.01', name_SC: 'Laporan Tahunan', desc_SC: 'Laporan kegiatan dan capaian tahunan.', retention: 10 },
  { code_MC: 'UM', code_SC: 'UM.04', name_SC: 'Serah Terima Aset', desc_SC: 'Berita acara serah terima aset dan inventaris.', retention: 5 },
  { code_MC: 'SDM', code_SC: 'SDM.01', name_SC: 'Rekrutmen', desc_SC: 'Pengumuman dan dokumentasi rekrutmen pegawai.', retention: 5 },
  { code_MC: 'SDM', code_SC: 'SDM.02', name_SC: 'Evaluasi Kinerja', desc_SC: 'Penilaian dan laporan evaluasi kinerja pegawai.', retention: 7 },
]

// ─── Mock Data: Dokumen ───────────────────────────────────────────────────────

export const mockDokumen = [
  { id: 'd1', title: 'Surat Keputusan Pengadaan Barang 2024', nomor: '001/KU.01/IV/2024', unit: 'Divisi Keuangan', tanggal: '2024-04-12', mc: 'Keuangan', sc: 'KU.01', retensi: 2026, sifat: 'Biasa', file_type: 'PDF' },
  { id: 'd2', title: 'Laporan Audit Internal Q1 2024', nomor: '024/KU.02/I/2024', unit: 'Divisi Audit', tanggal: '2024-01-15', mc: 'Keuangan', sc: 'KU.02', retensi: 2024, sifat: 'Rahasia', file_type: 'PDF' },
  { id: 'd3', title: 'Berita Acara Serah Terima Aset IT', nomor: '007/UM.04/II/2024', unit: 'Divisi Umum', tanggal: '2024-02-20', mc: 'Umum', sc: 'UM.04', retensi: 2024, sifat: 'Biasa', file_type: 'DOCX' },
  { id: 'd4', title: 'SK Pembentukan Tim Proyek Alpha', nomor: '012/HK.01/III/2024', unit: 'Divisi Hukum', tanggal: '2024-03-01', mc: 'Hukum', sc: 'HK.01', retensi: 2029, sifat: 'Biasa', file_type: 'PDF' },
  { id: 'd5', title: 'Kontrak Kerja Sama Vendor XYZ', nomor: '003/HK.02/I/2024', unit: 'Divisi Hukum', tanggal: '2024-01-05', mc: 'Hukum', sc: 'HK.02', retensi: 2025, sifat: 'Rahasia', file_type: 'PDF' },
  { id: 'd6', title: 'Surat Pengumuman Rekrutmen 2024', nomor: '031/SDM.01/V/2024', unit: 'Divisi SDM', tanggal: '2024-05-10', mc: 'SDM', sc: 'SDM.01', retensi: 2027, sifat: 'Terbuka', file_type: 'DOCX' },
  { id: 'd7', title: 'Nota Dinas Penyesuaian Anggaran', nomor: '042/KU.03/VI/2024', unit: 'Divisi Keuangan', tanggal: '2024-06-01', mc: 'Keuangan', sc: 'KU.03', retensi: 2025, sifat: 'Terbatas', file_type: 'PDF' },
  { id: 'd8', title: 'Laporan Tahunan Kegiatan 2023', nomor: '001/UM.01/XII/2023', unit: 'Divisi Umum', tanggal: '2023-12-31', mc: 'Umum', sc: 'UM.01', retensi: 2028, sifat: 'Terbuka', file_type: 'PDF' },
]

// ─── Mock Data: Notifikasi Retensi ────────────────────────────────────────────

export const mockNotifikasiRetensi = [
  { id: 'n1', docId: 'd2', title: 'Laporan Audit Internal Q1 2024', nomor: '024/KU.02/I/2024', unit: 'Divisi Audit', retensi: 2024, bulanSisa: 1, tindakan: null },
  { id: 'n2', docId: 'd3', title: 'Berita Acara Serah Terima Aset IT', nomor: '007/UM.04/II/2024', unit: 'Divisi Umum', retensi: 2024, bulanSisa: 3, tindakan: null },
  { id: 'n3', docId: 'd5', title: 'Kontrak Kerja Sama Vendor XYZ', nomor: '003/HK.02/I/2024', unit: 'Divisi Hukum', retensi: 2025, bulanSisa: 5, tindakan: null },
  { id: 'n4', docId: 'd7', title: 'Nota Dinas Penyesuaian Anggaran', nomor: '042/KU.03/VI/2024', unit: 'Divisi Keuangan', retensi: 2025, bulanSisa: 4, tindakan: null },
]

// ─── Mock Data: OCR Extraction Result ────────────────────────────────────────

export const mockOCRResult = {
  title: "Surat Keputusan Direktur No. 017",
  nomor_dokumen: "017/SDM.02/VII/2024",
  tanggal_dokumen: "2024-07-15",
  unit_pengolah: "Divisi SDM",
  sifat_dokumen: "Biasa",
  tentang: "Penetapan Tim Evaluasi Kinerja Semester I Tahun 2024",
  description: "Surat keputusan ini menetapkan susunan tim evaluasi kinerja pegawai untuk periode semester pertama tahun anggaran 2024.",
  konteks: "Evaluasi dilakukan berdasarkan KPI yang telah ditetapkan pada rapat kerja bulan Januari 2024.",
  code_SC: "SDM.02",
  mc: "SDM",
  status: "Aktif",
  sc_name: "Evaluasi Kinerja",
  retention: 3,
  tahun_retensi: 2027,
  confidence: {
    title: 92,
    nomor: 98,
    tanggal: 95,
    unit: 88,
    sifat: 85,
    tentang: 90,
    description: 75,
    konteks: 70,
  },
};
