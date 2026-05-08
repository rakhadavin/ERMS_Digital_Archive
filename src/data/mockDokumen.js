/**
 * mockDokumen.js
 * Data mock untuk tabel METADATA (dokumen arsip)
 * Nanti diganti dengan API call ke backend
 */

export const mockDokumen = [
  {
    id: 'd-001',
    unit_pengolah: 'Divisi Keuangan',
    nomor_dokumen: '001/KU.01/IV/2024',
    tanggal_dokumen: '2024-04-12',
    tahun_retensi: 2034,
    sifat_dokumen: 'Biasa',
    code_SC: 'KU.01',
    code_MC: 'KU',
    title: 'Surat Keputusan Pengadaan Barang Inventaris Kantor 2024',
    description: 'SK ini menetapkan prosedur dan pagu anggaran untuk pengadaan barang inventaris kantor tahun anggaran 2024 senilai Rp 450.000.000.',
    tentang: 'Penetapan Anggaran Pengadaan Barang Inventaris Kantor TA 2024',
    konteks: 'Pengadaan dilakukan melalui e-katalog LKPP sesuai Perpres No. 16 Tahun 2018 yang diperbarui.',
    file_path: '/mock/dokumen/KU01-001-2024.pdf',
    file_type: 'PDF',
    created_at: '2024-04-15T08:23:11Z',
    tindakan_retensi: null,
  },
  {
    id: 'd-002',
    unit_pengolah: 'Divisi Audit',
    nomor_dokumen: '024/KU.02/I/2024',
    tanggal_dokumen: '2024-01-15',
    tahun_retensi: 2024,
    sifat_dokumen: 'Rahasia',
    code_SC: 'KU.02',
    code_MC: 'KU',
    title: 'Laporan Audit Internal Keuangan Q1 2024',
    description: 'Laporan hasil audit internal terhadap laporan keuangan kuartal pertama 2024. Terdapat 3 temuan mayor yang memerlukan tindak lanjut segera.',
    tentang: 'Hasil Pemeriksaan Keuangan Kuartal I Tahun 2024',
    konteks: 'Audit dilaksanakan oleh tim SPI berdasarkan PKPT yang telah disetujui Direktur Utama.',
    file_path: '/mock/dokumen/KU02-024-2024.pdf',
    file_type: 'PDF',
    created_at: '2024-01-20T14:05:32Z',
    tindakan_retensi: null,
  },
  {
    id: 'd-003',
    unit_pengolah: 'Divisi Umum',
    nomor_dokumen: '007/UM.04/II/2024',
    tanggal_dokumen: '2024-02-20',
    tahun_retensi: 2029,
    sifat_dokumen: 'Biasa',
    code_SC: 'UM.04',
    code_MC: 'UM',
    title: 'Berita Acara Serah Terima Aset Perangkat IT Batch 3',
    description: 'Berita acara serah terima 24 unit laptop dan 8 unit printer dari Divisi Pengadaan kepada Divisi IT untuk distribusi ke unit kerja.',
    tentang: 'Serah Terima Aset Perangkat Teknologi Informasi Gelombang III',
    konteks: 'Merupakan bagian dari program modernisasi perangkat kerja 2024-2025 yang dianggarkan dalam RKAT.',
    file_path: '/mock/dokumen/UM04-007-2024.pdf',
    file_type: 'PDF',
    created_at: '2024-02-21T09:12:00Z',
    tindakan_retensi: null,
  },
  {
    id: 'd-004',
    unit_pengolah: 'Divisi Hukum',
    nomor_dokumen: '012/HK.01/III/2024',
    tanggal_dokumen: '2024-03-01',
    tahun_retensi: 2054,
    sifat_dokumen: 'Biasa',
    code_SC: 'HK.01',
    code_MC: 'HK',
    title: 'SK Pembentukan Tim Proyek Transformasi Digital Alpha',
    description: 'Surat Keputusan Direktur Utama mengenai pembentukan tim lintas fungsi untuk pelaksanaan proyek transformasi digital fase pertama.',
    tentang: 'Pembentukan Tim Proyek Transformasi Digital Fase I (Alpha)',
    konteks: 'Proyek Alpha merupakan inisiatif strategis 5 tahun dalam road map digitalisasi perusahaan 2024–2028.',
    file_path: '/mock/dokumen/HK01-012-2024.pdf',
    file_type: 'PDF',
    created_at: '2024-03-05T10:44:22Z',
    tindakan_retensi: null,
  },
  {
    id: 'd-005',
    unit_pengolah: 'Divisi Hukum',
    nomor_dokumen: '003/HK.02/I/2024',
    tanggal_dokumen: '2024-01-05',
    tahun_retensi: 2034,
    sifat_dokumen: 'Rahasia',
    code_SC: 'HK.02',
    code_MC: 'HK',
    title: 'Kontrak Kerja Sama Layanan Cloud Infrastructure Vendor XYZ',
    description: 'PKS antara perusahaan dengan PT XYZ Teknologi mengenai penyediaan layanan cloud infrastructure selama 3 tahun dengan nilai kontrak Rp 2,4 miliar.',
    tentang: 'Perjanjian Kerja Sama Layanan Cloud Infrastructure 2024–2027',
    konteks: 'Kontrak ini merupakan hasil negosiasi ulang dari kontrak sebelumnya dengan penambahan klausul SLA 99,9%.',
    file_path: '/mock/dokumen/HK02-003-2024.pdf',
    file_type: 'PDF',
    created_at: '2024-01-08T11:30:00Z',
    tindakan_retensi: null,
  },
  {
    id: 'd-006',
    unit_pengolah: 'Divisi SDM',
    nomor_dokumen: '031/SDM.01/V/2024',
    tanggal_dokumen: '2024-05-10',
    tahun_retensi: 2029,
    sifat_dokumen: 'Terbuka',
    code_SC: 'SDM.01',
    code_MC: 'SDM',
    title: 'Pengumuman Rekrutmen Pegawai Baru Gelombang II Tahun 2024',
    description: 'Pengumuman resmi pembukaan rekrutmen untuk 15 posisi di berbagai divisi, termasuk syarat dan tata cara pendaftaran.',
    tentang: 'Pengumuman Penerimaan Pegawai Baru Gelombang II 2024',
    konteks: 'Rekrutmen ini untuk memenuhi kebutuhan SDM dalam rangka ekspansi layanan regional.',
    file_path: '/mock/dokumen/SDM01-031-2024.pdf',
    file_type: 'PDF',
    created_at: '2024-05-12T08:00:00Z',
    tindakan_retensi: null,
  },
  {
    id: 'd-007',
    unit_pengolah: 'Divisi Keuangan',
    nomor_dokumen: '042/KU.03/VI/2024',
    tanggal_dokumen: '2024-06-01',
    tahun_retensi: 2034,
    sifat_dokumen: 'Terbatas',
    code_SC: 'KU.03',
    code_MC: 'KU',
    title: 'Nota Dinas Penyesuaian Anggaran Semester II 2024',
    description: 'Nota dinas kepada seluruh kepala divisi mengenai penyesuaian pagu anggaran semester kedua akibat perubahan asumsi makroekonomi.',
    tentang: 'Penyesuaian Pagu Anggaran Divisi Semester II TA 2024',
    konteks: 'Penyesuaian dilakukan berdasarkan hasil rapat koordinasi keuangan tanggal 28 Mei 2024.',
    file_path: '/mock/dokumen/KU03-042-2024.docx',
    file_type: 'DOCX',
    created_at: '2024-06-03T13:15:00Z',
    tindakan_retensi: null,
  },
  {
    id: 'd-008',
    unit_pengolah: 'Divisi Umum',
    nomor_dokumen: '001/UM.01/XII/2023',
    tanggal_dokumen: '2023-12-31',
    tahun_retensi: 2028,
    sifat_dokumen: 'Terbuka',
    code_SC: 'UM.01',
    code_MC: 'UM',
    title: 'Laporan Tahunan Kegiatan Organisasi Tahun 2023',
    description: 'Kompilasi laporan kegiatan seluruh divisi sepanjang tahun 2023, mencakup capaian, kendala, dan rekomendasi untuk 2024.',
    tentang: 'Laporan Tahunan Kegiatan & Capaian Kinerja Tahun 2023',
    konteks: 'Laporan ini disampaikan kepada Dewan Pengawas dalam rapat tahunan Januari 2024.',
    file_path: '/mock/dokumen/UM01-001-2023.pdf',
    file_type: 'PDF',
    created_at: '2024-01-10T16:00:00Z',
    tindakan_retensi: null,
  },
  {
    id: 'd-009',
    unit_pengolah: 'Divisi IT',
    nomor_dokumen: '005/IT.02/III/2024',
    tanggal_dokumen: '2024-03-18',
    tahun_retensi: 2034,
    sifat_dokumen: 'Rahasia',
    code_SC: 'IT.02',
    code_MC: 'IT',
    title: 'Laporan Insiden Keamanan Siber Maret 2024',
    description: 'Laporan lengkap mengenai insiden percobaan intrusi pada sistem core banking tertanggal 14 Maret 2024, termasuk analisis forensik dan langkah mitigasi.',
    tentang: 'Laporan Insiden & Mitigasi Keamanan Sistem Maret 2024',
    konteks: 'Insiden ditangani dalam waktu 4 jam. Tidak ada kebocoran data yang terkonfirmasi.',
    file_path: '/mock/dokumen/IT02-005-2024.pdf',
    file_type: 'PDF',
    created_at: '2024-03-20T09:00:00Z',
    tindakan_retensi: null,
  },
  {
    id: 'd-010',
    unit_pengolah: 'Divisi SDM',
    nomor_dokumen: '017/SDM.02/VII/2024',
    tanggal_dokumen: '2024-07-15',
    tahun_retensi: 2029,
    sifat_dokumen: 'Biasa',
    code_SC: 'SDM.02',
    code_MC: 'SDM',
    title: 'SK Penetapan Tim Evaluasi Kinerja Semester I 2024',
    description: 'Surat keputusan yang menetapkan susunan tim evaluasi kinerja pegawai untuk semester pertama tahun anggaran 2024.',
    tentang: 'Penetapan Tim Evaluasi Kinerja Pegawai Semester I Tahun 2024',
    konteks: 'Evaluasi dilakukan berdasarkan KPI yang ditetapkan pada rapat kerja Januari 2024.',
    file_path: '/mock/dokumen/SDM02-017-2024.pdf',
    file_type: 'PDF',
    created_at: '2024-07-16T10:30:00Z',
    tindakan_retensi: null,
  },
  {
    id: 'd-011',
    unit_pengolah: 'Divisi Hubungan Publik',
    nomor_dokumen: '008/PR.01/VIII/2024',
    tanggal_dokumen: '2024-08-01',
    tahun_retensi: 2034,
    sifat_dokumen: 'Terbuka',
    code_SC: 'PR.01',
    code_MC: 'PR',
    title: 'Siaran Pers Peluncuran Layanan Digital Baru "ArsipKu"',
    description: 'Press release resmi peluncuran aplikasi ArsipKu untuk masyarakat umum, mencakup fitur utama, cara akses, dan narahubung media.',
    tentang: 'Peluncuran Resmi Aplikasi Layanan Digital ArsipKu untuk Publik',
    konteks: 'Peluncuran dilakukan bertepatan dengan Hari Arsip Nasional 18 Agustus 2024.',
    file_path: '/mock/dokumen/PR01-008-2024.pdf',
    file_type: 'PDF',
    created_at: '2024-08-02T07:00:00Z',
    tindakan_retensi: null,
  },
  {
    id: 'd-012',
    unit_pengolah: 'Divisi Umum',
    nomor_dokumen: '019/UM.02/IX/2024',
    tanggal_dokumen: '2024-09-10',
    tahun_retensi: 2029,
    sifat_dokumen: 'Biasa',
    code_SC: 'UM.02',
    code_MC: 'UM',
    title: 'Notulen Rapat Koordinasi Strategis Q3 2024',
    description: 'Notulensi rapat koordinasi pimpinan divisi membahas evaluasi capaian Q3 dan penyusunan rencana aksi Q4 2024.',
    tentang: 'Notulen Rapat Koordinasi Pimpinan Kuartal III 2024',
    konteks: 'Rapat dipimpin oleh Direktur Utama dan dihadiri 12 kepala divisi.',
    file_path: '/mock/dokumen/UM02-019-2024.pdf',
    file_type: 'PDF',
    created_at: '2024-09-11T15:45:00Z',
    tindakan_retensi: null,
  },
]

/**
 * Data mock untuk notifikasi retensi
 * Dokumen yang retensinya <= 6 bulan dari sekarang
 */
export const mockNotifikasiRetensi = [
  {
    id: 'n-001',
    doc_id: 'd-002',
    title: 'Laporan Audit Internal Keuangan Q1 2024',
    nomor_dokumen: '024/KU.02/I/2024',
    unit_pengolah: 'Divisi Audit',
    tahun_retensi: 2024,
    bulan_sisa: 1,
    sifat_dokumen: 'Rahasia',
    tindakan: null,
    tindakan_oleh: null,
    tindakan_at: null,
  },
  {
    id: 'n-002',
    doc_id: 'd-013',
    title: 'Dokumen Rencana Kerja Anggaran 2019',
    nomor_dokumen: '001/KU.03/I/2019',
    unit_pengolah: 'Divisi Keuangan',
    tahun_retensi: 2024,
    bulan_sisa: 2,
    sifat_dokumen: 'Terbatas',
    tindakan: null,
    tindakan_oleh: null,
    tindakan_at: null,
  },
  {
    id: 'n-003',
    doc_id: 'd-014',
    title: 'Berita Acara Pemeriksaan Aset Tetap 2019',
    nomor_dokumen: '003/UM.03/XII/2019',
    unit_pengolah: 'Divisi Umum',
    tahun_retensi: 2024,
    bulan_sisa: 3,
    sifat_dokumen: 'Biasa',
    tindakan: null,
    tindakan_oleh: null,
    tindakan_at: null,
  },
  {
    id: 'n-004',
    doc_id: 'd-015',
    title: 'Kontrak Kerja Sama Vendor Layanan Kebersihan 2019',
    nomor_dokumen: '007/HK.02/III/2019',
    unit_pengolah: 'Divisi Umum',
    tahun_retensi: 2024,
    bulan_sisa: 4,
    sifat_dokumen: 'Biasa',
    tindakan: null,
    tindakan_oleh: null,
    tindakan_at: null,
  },
  {
    id: 'n-005',
    doc_id: 'd-016',
    title: 'Laporan Pelatihan Kompetensi SDM Semester II 2019',
    nomor_dokumen: '012/SDM.03/VII/2019',
    unit_pengolah: 'Divisi SDM',
    tahun_retensi: 2024,
    bulan_sisa: 5,
    sifat_dokumen: 'Biasa',
    tindakan: null,
    tindakan_oleh: null,
    tindakan_at: null,
  },
]

/**
 * Data mock untuk OCR hasil ekstraksi
 * Digunakan di halaman Auto-Metadata untuk simulasi
 */
export const mockOcrResult = {
  title: 'Surat Keputusan Direktur Nomor 017 Tahun 2024',
  nomor_dokumen: '017/SDM.02/VII/2024',
  tanggal_dokumen: '2024-07-15',
  unit_pengolah: 'Divisi SDM',
  sifat_dokumen: 'Biasa',
  tentang: 'Penetapan Tim Evaluasi Kinerja Pegawai Semester I Tahun 2024',
  description:
    'Surat keputusan ini menetapkan susunan tim evaluasi kinerja pegawai untuk periode semester pertama tahun anggaran 2024 berdasarkan KPI yang telah ditetapkan.',
  konteks:
    'Evaluasi dilakukan berdasarkan KPI yang telah ditetapkan pada rapat kerja bulan Januari 2024. Tim terdiri dari 7 anggota lintas divisi.',
  // Hasil parsing nomor dokumen → kode klasifikasi
  kode_klasifikasi: 'SDM.02',
  // Hasil lookup ke sub-kategori
  code_SC: 'SDM.02',
  code_MC: 'SDM',
  name_MC: 'Sumber Daya Manusia',
  name_SC: 'Evaluasi Kinerja',
  retention: 5,
  tahun_retensi: 2029,
  // Confidence score per field (0-100)
  confidence: {
    title: 91,
    nomor_dokumen: 98,
    tanggal_dokumen: 95,
    unit_pengolah: 87,
    sifat_dokumen: 84,
    tentang: 90,
    description: 76,
    konteks: 69,
  },
}

/**
 * Helpers
 */

/** Cari dokumen berdasarkan ID */
export function getDokumenById(id) {
  return mockDokumen.find((d) => d.id === id) || null
}

/** Filter dokumen berdasarkan code_MC */
export function getDokumenByMC(code_MC) {
  return mockDokumen.filter((d) => d.code_MC === code_MC)
}

/** Filter dokumen berdasarkan code_SC */
export function getDokumenBySC(code_SC) {
  return mockDokumen.filter((d) => d.code_SC === code_SC)
}

/** Hitung jumlah notifikasi yang belum ditangani */
export function getNotifBelumDitangani(notifList) {
  return notifList.filter((n) => n.tindakan === null).length
}

/** Statistik ringkasan untuk dashboard */
export function getDashboardStats(dokumenList, notifList) {
  return {
    totalDokumen: dokumenList.length,
    akanKadaluarsa: notifList.filter((n) => !n.tindakan).length,
    uploadBulanIni: dokumenList.filter((d) => {
      const created = new Date(d.created_at)
      const now = new Date()
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      )
    }).length,
    dokumenRahasia: dokumenList.filter((d) => d.sifat_dokumen === 'Rahasia').length,
  }
}
