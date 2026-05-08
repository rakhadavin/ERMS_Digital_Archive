/**
 * useOcr.js
 * Custom hook untuk alur Auto-Metadata (upload -> OCR -> review -> save)
 */
import { useState, useCallback } from 'react'
import { mockOcrResult } from '@/data'
import { parseKodeKlasifikasi } from '@/utils'

/** Tahap-tahap proses OCR */
export const OCR_STEPS = [
  { id: 'upload',     label: 'Mengunggah file' },
  { id: 'ocr',        label: 'Menjalankan OCR' },
  { id: 'mapping',    label: 'Memetakan field metadata' },
  { id: 'klasifikasi',label: 'Mencari kode klasifikasi' },
]

/**
 * Hook utama untuk halaman Auto-Metadata.
 *
 * @returns {{
 *   phase: 'upload'|'processing'|'review'|'saved',
 *   currentStep: number,
 *   fileName: string,
 *   formData: object,
 *   klasifikasiError: string|null,
 *   startUpload: Function,
 *   updateField: Function,
 *   handleSave: Function,
 *   handleReset: Function,
 * }}
 */
export function useOcr() {
  const [phase, setPhase] = useState('upload')       // 'upload' | 'processing' | 'review' | 'saved'
  const [currentStep, setCurrentStep] = useState(0)  // 0-4 (index step OCR)
  const [fileName, setFileName] = useState('')
  const [formData, setFormData] = useState(null)
  const [klasifikasiError, setKlasifikasiError] = useState(null)

  /**
   * Mulai proses upload + simulasi OCR
   * @param {File} file
   */
  const startUpload = useCallback((file) => {
    if (!file) return

    setFileName(file.name)
    setPhase('processing')
    setCurrentStep(0)

    // Simulasi delay tiap step OCR
    const delays = [400, 900, 1400, 1900]
    delays.forEach((delay, i) => {
      setTimeout(() => setCurrentStep(i + 1), delay)
    })

    // Selesai processing → pindah ke fase review
    setTimeout(() => {
      const hasil = { ...mockOcrResult }

      // Cek apakah kode klasifikasi berhasil diparsing
      const parseHasil = parseKodeKlasifikasi(hasil.nomor_dokumen)
      if (!parseHasil.success) {
        setKlasifikasiError(
          `Kode klasifikasi tidak ditemukan dari nomor dokumen "${hasil.nomor_dokumen}". Silakan isi manual.`
        )
      } else {
        setKlasifikasiError(null)
      }

      setFormData(hasil)
      setPhase('review')
    }, 2200)
  }, [])

  /**
   * Update satu field di form review
   * @param {string} field
   * @param {string|number} value
   */
  const updateField = useCallback((field, value) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev))
  }, [])

  /**
   * Simpan metadata (mock — nanti kirim ke API)
   */
  const handleSave = useCallback(() => {
    // TODO: POST /api/dokumen dengan formData
    setPhase('saved')
  }, [])

  /**
   * Reset ke fase awal (upload dokumen lain)
   */
  const handleReset = useCallback(() => {
    setPhase('upload')
    setCurrentStep(0)
    setFileName('')
    setFormData(null)
    setKlasifikasiError(null)
  }, [])

  return {
    phase,
    currentStep,
    fileName,
    formData,
    klasifikasiError,
    startUpload,
    updateField,
    handleSave,
    handleReset,
  }
}
