// ocrService.js - Mock OCR service for extracting text from documents

export class OCRService {
  /**
   * Extracts text from a file
   * @param {File} file - The uploaded file
   * @returns {Promise<string>} - Extracted text
   */
  static async extractText(file) {
    // Simulate OCR processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo, return mock text based on file name or type
    // In real implementation, use Tesseract.js or other OCR library
    const mockTexts = {
      'pdf': `SURAT KEPUTUSAN DIREKTUR
Nomor: 017/SDM.02/VII/2024
Tanggal: 15 Juli 2024

UNIT PENGOLAH: Divisi SDM

PERIHAL: Penetapan Tim Evaluasi Kinerja Semester I Tahun 2024

SIFAT: Biasa

DESKRIPSI: Surat keputusan ini menetapkan susunan tim evaluasi kinerja pegawai untuk periode semester pertama tahun anggaran 2024.

KONTEKS: Evaluasi dilakukan berdasarkan KPI yang telah ditetapkan pada rapat kerja bulan Januari 2024.`,

      'jpg': `BERITA ACARA SERAH TERIMA
Nomor: 007/UM.04/II/2024
Tanggal: 20 Februari 2024

UNIT: Divisi Umum

PERIHAL: Serah Terima Aset IT

SIFAT: Biasa

DESKRIPSI: Berita acara serah terima peralatan komputer dan jaringan dari vendor ke divisi IT.`,

      'png': `KONTRAK KERJA SAMA
Nomor: 003/HK.02/I/2024
Tanggal: 5 Januari 2024

UNIT: Divisi Hukum

PERIHAL: Kerja Sama dengan Vendor XYZ

SIFAT: Rahasia

DESKRIPSI: Perjanjian kontrak kerja sama pengembangan sistem informasi dengan PT XYZ.`,

      'docx': `LAPORAN AUDIT INTERNAL
Nomor: 024/KU.02/I/2024
Tanggal: 15 Januari 2024

UNIT: Divisi Audit

PERIHAL: Laporan Audit Q1 2024

SIFAT: Rahasia

DESKRIPSI: Hasil audit internal triwulan pertama tahun 2024 menunjukkan kepatuhan 95%.`
    };

    const fileType = file.name.split('.').pop().toLowerCase();
    return mockTexts[fileType] || mockTexts.pdf;
  }
}