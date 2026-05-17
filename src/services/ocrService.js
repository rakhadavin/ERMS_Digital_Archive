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
      // PDF → valid MR code → classification FOUND
      'pdf': `KEBIJAKAN MONETER
Nomor: 001/MR.01.01.01/IV/2024
Tanggal: 12 April 2024

UNIT PENGOLAH: Departemen Moneter

PERIHAL: Penetapan Arah Kebijakan Moneter Triwulan II Tahun 2024

SIFAT: Biasa

DESKRIPSI: Dokumen kebijakan moneter yang menetapkan arah dan instrumen kebijakan Bank Indonesia untuk triwulan kedua tahun 2024.

KONTEKS: Disusun berdasarkan hasil Rapat Dewan Gubernur April 2024 dengan mempertimbangkan dinamika inflasi global.`,

      // JPG → unrecognized code → classification NOT FOUND, manual required
      'jpg': `NOTA DINAS
Nomor: 007/IT.04/II/2024
Tanggal: 20 Februari 2024

UNIT: Divisi Teknologi Informasi

PERIHAL: Pembaruan Infrastruktur Jaringan

SIFAT: Biasa

DESKRIPSI: Nota dinas mengenai rencana pembaruan infrastruktur jaringan internal kantor pusat.`,

      // PNG → unrecognized code → classification NOT FOUND, manual required
      'png': `SURAT EDARAN
Nomor: 003/OPS.02/I/2024
Tanggal: 5 Januari 2024

UNIT: Divisi Operasional

PERIHAL: Prosedur Operasional Standar Layanan Loket

SIFAT: Biasa

DESKRIPSI: Surat edaran penyempurnaan prosedur operasional standar layanan loket teller.`,

      // DOCX → unrecognized code → classification NOT FOUND, manual required
      'docx': `LAPORAN EVALUASI
Nomor: 024/LOG.01/I/2024
Tanggal: 15 Januari 2024

UNIT: Divisi Logistik

PERIHAL: Evaluasi Pengelolaan Aset Logistik Q4 2023

SIFAT: Biasa

DESKRIPSI: Laporan evaluasi pengelolaan aset logistik sepanjang kuartal keempat tahun 2023.`
    };

    const fileType = file.name.split('.').pop().toLowerCase();
    return mockTexts[fileType] || mockTexts.pdf;
  }
}