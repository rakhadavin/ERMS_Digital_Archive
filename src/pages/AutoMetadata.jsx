import { useState, useRef } from 'react'
import {
  CloudUpload, Sparkles, Code2, ClipboardCheck,
  ArrowLeft, Save, CheckCircle2, Upload, Check,
} from 'lucide-react'
import { OCRService } from '../services/ocrService.js'
import { saveDocument, documentExists } from '../services/documentService.js'
import { extractMetadata } from '../utils/metadataExtractor.js'
import { classifyDocument } from '../utils/classification.js'
import { calculateRetentionYear } from '../utils/retention.js'
import { ConfidenceBar, FormField } from '../components/ui.jsx'

const OCR_STEPS = [
  'Mengunggah file',
  'Menjalankan OCR',
  'Memetakan field metadata',
  'Mencari kode klasifikasi',
]

const ACCESS_GROUPS = [
  { code: "E", label: "Executive Access", level: "L7–L9" },
  { code: "R", label: "Regulatory Access", level: "L5–L6" },
  { code: "M", label: "Managerial Access", level: "L4" },
  { code: "S", label: "Staff Access", level: "L1–L3" },
];

// ─── Upload Phase ─────────────────────────────────────────────────────────────
function PhaseUpload({ onStart }) {
  const [drag, setDrag] = useState(false)
  const fileRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f && validateFile(f)) onStart(f)
  }

  const handleChange = (e) => {
    const f = e.target.files[0]
    if (f && validateFile(f)) onStart(f)
  }

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 20 * 1024 * 1024 // 20MB

    if (!allowedTypes.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan PDF, JPG, PNG, atau DOCX.')
      return false
    }

    if (file.size > maxSize) {
      alert('Ukuran file maksimal 20MB.')
      return false
    }

    return true
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
            <Sparkles size={18} className="text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-semibold">Auto-Metadata</p>
            <p className="text-xs text-gray-500">Upload dokumen → OCR → Form otomatis terisi</p>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-all
            ${drag ? 'border-brand-400 bg-brand-50' : 'border-gray-200 bg-gray-50 hover:border-brand-300 hover:bg-brand-50'}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current.click()}
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.docx"
            onChange={handleChange}
          />
          <CloudUpload size={40} className="text-brand-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-800">Tarik &amp; Lepas Dokumen di Sini</p>
          <p className="text-xs text-gray-500 mt-1">atau klik untuk memilih file</p>
          <p className="text-[10px] text-gray-400 mt-3">PDF, JPG, PNG, DOCX · Maks. 20MB</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { Icon: Sparkles, label: 'OCR Otomatis', desc: 'Ekstraksi teks akurat dari berbagai format' },
          { Icon: Code2, label: 'Parsing Cerdas', desc: 'Pemetaan field metadata secara otomatis' },
          { Icon: ClipboardCheck, label: 'Skor Kepercayaan', desc: 'Indikator akurasi tiap field yang terisi' },
        ].map(({ Icon, label, desc }, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3">
            <Icon size={20} className="text-brand-400 mb-2" />
            <p className="text-xs font-semibold text-gray-800">{label}</p>
            <p className="text-[11px] text-gray-500 mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Processing Phase ─────────────────────────────────────────────────────────
function PhaseProcessing({ fileName, step }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="card text-center py-10">
        <div className="w-10 h-10 border-[3px] border-gray-100 border-t-brand-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-gray-800">Memproses Dokumen...</p>
        <p className="text-xs text-gray-500 mt-1">{fileName}</p>
        <div className="flex flex-col gap-2 text-left max-w-[220px] mx-auto mt-5">
          {OCR_STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-[13px] transition-colors
                ${step > i ? 'text-brand-600' : step === i ? 'text-gray-800 font-medium' : 'text-gray-400'}`}
            >
              <div className="w-5 h-5 rounded-full border-[1.5px] border-current flex items-center justify-center shrink-0">
                {step > i ? (
                  <Check size={10} />
                ) : step === i ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                ) : null}
              </div>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Review Phase ─────────────────────────────────────────────────────────────
function PhaseReview({ fileName, formData, setFormData, onSave, onReset, error }) {
  const AutoInput = ({ field, type = 'text', conf }) => (
    <input
      type={type}
      className={`form-input${conf !== undefined ? ' auto-filled' : ''}`}
      value={formData[field] ?? ''}
      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
    />
  )

  const ReadOnly = ({ field, highlight }) => (
    <div
      className={`form-input readonly flex items-center min-h-[38px]
        ${highlight ? 'font-semibold text-brand-600' : ''}`}
    >
      {formData[field] ?? '—'}
    </div>
  )

  const c = formData.confidence ?? {}

  return (
    <div className="max-w-2xl mx-auto">
      {/* Banner */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2 text-xs text-brand-600 font-medium flex items-center gap-2">
          <Sparkles size={13} />
          Field berwarna = terisi otomatis oleh OCR · Periksa sebelum menyimpan
        </div>
        <button className="btn btn-sm" onClick={onReset}>
          <ArrowLeft size={13} />
          Ganti File
        </button>
        <button className="btn btn-primary btn-sm" onClick={onSave}>
          <Save size={13} />
          Simpan Metadata
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

      {/* Informasi Dokumen */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm font-semibold">Informasi Dokumen</p>
          <span className="badge badge-green ml-auto">{fileName}</span>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <FormField label="Judul Dokumen" conf={c.title}>
            <AutoInput field="title" conf={c.title} />
          </FormField>
          <FormField label="Nomor Dokumen" conf={c.nomor}>
            <AutoInput field="nomor_dokumen" conf={c.nomor} />
          </FormField>
          <FormField label="Tanggal Dokumen" conf={c.tanggal}>
            <AutoInput field="tanggal_dokumen" type="date" conf={c.tanggal} />
          </FormField>
          <FormField label="Unit Pengolah" conf={c.unit}>
            <AutoInput field="unit_pengolah" conf={c.unit} />
          </FormField>
          <FormField label="Sifat Dokumen" conf={c.sifat}>
            <select className="form-input auto-filled" value={formData.sifat_dokumen ?? ""} onChange={(e) => setFormData({ ...formData, sifat_dokumen: e.target.value })}>
              {["Biasa", "Terbatas", "Rahasia", "Terbuka"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Perihal / Tentang" conf={c.tentang}>
            <AutoInput field="tentang" conf={c.tentang} />
          </FormField>
          <FormField label="Deskripsi" conf={c.description}>
            <AutoInput field="description" conf={c.description} />
          </FormField>
          <FormField label="Konteks" conf={c.konteks} full>
            <textarea className="form-input auto-filled resize-y" rows={2} value={formData.konteks ?? ""} onChange={(e) => setFormData({ ...formData, konteks: e.target.value })} />
          </FormField>
        </div>
      </div>

      {/* Klasifikasi */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm font-semibold">Klasifikasi Otomatis</p>
          <span className="badge badge-blue ml-auto">Dari kode: {formData.code_SC}</span>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <FormField label="Kode Sub-Kategori">
            <ReadOnly field="code_SC" />
          </FormField>
          <FormField label="Sub-Kategori">
            <ReadOnly field="sc_name" />
          </FormField>
          <FormField label="Kategori Utama">
            <ReadOnly field="mc" />
          </FormField>
          <FormField label="Masa Retensi">
            <div className="form-input readonly flex items-center min-h-[38px]">{formData.retention} Tahun</div>
          </FormField>
          <FormField label="Tahun Retensi">
            <ReadOnly field="tahun_retensi" highlight />
          </FormField>
          <FormField label="Status">
            <ReadOnly field="status" highlight />
          </FormField>
          <FormField label="Hak Akses">
            <select className="form-input" value={formData.hak_akses ?? ""} onChange={(e) => setFormData({ ...formData, hak_akses: e.target.value })}>
              <option value="">Pilih hak akses</option>
              {ACCESS_GROUPS.map((group) => (
                <option key={group.code} value={group.code}>
                  {group.code} — {group.label} ({group.level})
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>
    </div>
  );
}

// ─── Success Phase ────────────────────────────────────────────────────────────
function PhaseSaved({ formData, onReset }) {
  return (
    <div className="max-w-md mx-auto text-center pt-10">
      <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={36} className="text-brand-400" />
      </div>
      <p className="text-lg font-bold text-gray-900">Metadata Tersimpan!</p>
      <p className="text-sm text-gray-500 mt-1.5">Dokumen berhasil diklasifikasikan dan disimpan ke arsip.</p>
      <div className="card mt-5 text-left text-sm">
        <p className="text-xs text-gray-400 mb-2">Ringkasan:</p>
        {[
          ["Judul", formData.title],
          ["Nomor", formData.nomor_dokumen],
          ["Unit", formData.unit_pengolah],
          ["Sub-Kategori", `${formData.code_SC} — ${formData.sc_name}`],
          ["Hak Akses", formData.hak_akses],
          ["Tahun Retensi", formData.tahun_retensi],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-gray-400 w-28 shrink-0">{k}</span>
            <span className="font-medium text-gray-800">{v}</span>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-5" onClick={onReset}>
        <Upload size={14} />
        Upload Dokumen Lain
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AutoMetadata() {
  const [phase, setPhase] = useState('upload')
  const [fileName, setFileName] = useState('')
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)

  const startProcessing = async (selectedFile) => {
    if (!selectedFile) return

    setFile(selectedFile)
    setFileName(selectedFile.name)
    setPhase('processing')
    setStep(0)
    setError('')

    try {
      // Step 1: Upload file
      setStep(1)
      await new Promise(resolve => setTimeout(resolve, 500))

      // Step 2: Run OCR
      setStep(2)
      const extractedText = await OCRService.extractText(selectedFile)

      // Step 3: Map metadata
      setStep(3)
      const metadata = extractMetadata(extractedText)

      // Step 4: Parse classification
      setStep(4)
      let classification = null
      if (metadata.nomor_dokumen) {
        classification = classifyDocument(metadata.nomor_dokumen)
        if (!classification.success) {
          // Show alert but continue
          alert(classification.error + '. Silakan pilih kategori secara manual.')
        }
      }

      // Combine metadata with classification
      const processedData = {
        ...metadata,
        status: "ACTIVE",
        ...(classification?.success
          ? {
              code_SC: classification.data.code_SC,
              sc_name: classification.data.name_SC,
              code_MC: classification.data.code_MC,
              status: classification.data.status ?? "ACTIVE",
              retention: classification.data.retention,
              tahun_retensi: metadata.tanggal_dokumen ? calculateRetentionYear(metadata.tanggal_dokumen, classification.data.retention) : null,
            }
          : {}),
      };

      setFormData(processedData)
      setPhase('review')

    } catch (err) {
      setError('Failed to process document: ' + err.message)
      setPhase('upload')
    }
  }

  const reset = () => {
    setPhase('upload')
    setStep(0)
    setFormData({})
    setFile(null)
    setError('')
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.nomor_dokumen || !formData.title) {
        setError('Nomor dokumen dan judul wajib diisi')
        return
      }

      // Check if document already exists
      if (documentExists(formData.nomor_dokumen)) {
        setError('Dokumen dengan nomor ini sudah ada')
        return
      }

      // Save document
      await saveDocument({
        title: formData.title,
        nomor: formData.nomor_dokumen,
        tanggal: formData.tanggal_dokumen,
        unit: formData.unit_pengolah,
        sifat: formData.sifat_dokumen,
        tentang: formData.tentang,
        description: formData.description,
        konteks: formData.konteks,
        mc: formData.code_MC,
        sc: formData.code_SC,
        retensi: formData.tahun_retensi,
        status: formData.status,
        file_type: file?.name.split(".").pop().toUpperCase(),
        hak_akses: formData.hak_akses,
      });

      setPhase('saved')
    } catch (err) {
      setError('Failed to save document: ' + err.message)
    }
  }

  return (
    <div className="p-7">
      {phase === 'upload' && <PhaseUpload onStart={startProcessing} />}
      {phase === 'processing' && <PhaseProcessing fileName={fileName} step={step} />}
      {phase === 'review' && (
        <PhaseReview
          fileName={fileName}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onReset={reset}
          error={error}
        />
      )}
      {phase === 'saved' && <PhaseSaved formData={formData} onReset={reset} />}
    </div>
  )
}
