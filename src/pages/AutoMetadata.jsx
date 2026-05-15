import { useState, useRef } from 'react'
import {
  CloudUpload, Sparkles, Code2, ClipboardCheck,
  ArrowLeft, Save, CheckCircle2, Upload, Check, X, FileText, AlertCircle,
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
]

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_SIZE = 20 * 1024 * 1024

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Format tidak didukung (PDF, JPG, PNG, DOCX)'
  if (file.size > MAX_SIZE) return 'Ukuran maks. 20MB'
  return null
}

async function runOcrPipeline(doc, updateDoc) {
  updateDoc(doc.id, { status: 'processing', step: 0 })
  try {
    updateDoc(doc.id, { step: 1 })
    await new Promise(r => setTimeout(r, 500))

    updateDoc(doc.id, { step: 2 })
    const text = await OCRService.extractText(doc.file)

    updateDoc(doc.id, { step: 3 })
    const metadata = extractMetadata(text)

    updateDoc(doc.id, { step: 4 })
    let klasifikasiError = null
    let classificationFields = {}
    if (metadata.nomor_dokumen) {
      const result = classifyDocument(metadata.nomor_dokumen)
      if (result.success) {
        classificationFields = {
          code_SC: result.data.code_SC,
          sc_name: result.data.name_SC,
          code_MC: result.data.code_MC,
          status: result.data.status ?? 'ACTIVE',
          retention: result.data.retention,
          tahun_retensi: metadata.tanggal_dokumen
            ? calculateRetentionYear(metadata.tanggal_dokumen, result.data.retention)
            : null,
        }
      } else {
        klasifikasiError = result.error + '. Silakan pilih kategori secara manual.'
      }
    }

    updateDoc(doc.id, {
      status: 'done',
      formData: { ...metadata, status: 'ACTIVE', klasifikasiError, ...classificationFields },
    })
  } catch (err) {
    updateDoc(doc.id, { status: 'error', error: 'Gagal memproses: ' + err.message })
  }
}

// ─── Upload Phase ─────────────────────────────────────────────────────────────
function PhaseUpload({ onStart }) {
  const [drag, setDrag] = useState(false)
  const [selected, setSelected] = useState([])
  const [fileErrors, setFileErrors] = useState({})
  const fileRef = useRef()

  const addFiles = (incoming) => {
    const valid = []
    const errors = {}
    Array.from(incoming).forEach(f => {
      const err = validateFile(f)
      if (err) {
        errors[f.name] = err
      } else if (!selected.some(s => s.name === f.name && s.size === f.size)) {
        valid.push(f)
      }
    })
    setSelected(prev => [...prev, ...valid])
    setFileErrors(prev => ({ ...prev, ...errors }))
  }

  const removeFile = (idx) => setSelected(prev => prev.filter((_, i) => i !== idx))

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

        {/* Multi-upload info box */}
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-lg px-3.5 py-2.5 mb-4">
          <CloudUpload size={15} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-700">Upload beberapa dokumen sekaligus</p>
            <p className="text-[11px] text-blue-500 mt-0.5">
              Pilih atau seret banyak file dalam satu kali upload. Semua akan diproses secara bersamaan dan dapat ditinjau sebelum disimpan.
            </p>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-all
            ${drag ? 'border-brand-400 bg-brand-50' : 'border-gray-200 bg-gray-50 hover:border-brand-300 hover:bg-brand-50'}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
          onClick={() => fileRef.current.click()}
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.docx"
            multiple
            onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
          />
          <CloudUpload size={40} className="text-brand-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-800">Tarik &amp; Lepas Dokumen di Sini</p>
          <p className="text-xs text-gray-500 mt-1">atau klik untuk memilih beberapa file sekaligus</p>
          <p className="text-[10px] text-gray-400 mt-3">PDF, JPG, PNG, DOCX · Maks. 20MB per file</p>
        </div>

        {Object.keys(fileErrors).length > 0 && (
          <div className="mt-3 space-y-1">
            {Object.entries(fileErrors).map(([name, err]) => (
              <div key={name} className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                <AlertCircle size={12} />
                <span className="font-medium truncate">{name}</span>: {err}
              </div>
            ))}
          </div>
        )}

        {selected.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500">{selected.length} file dipilih</p>
            {selected.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <FileText size={14} className="text-brand-400 shrink-0" />
                <span className="text-xs text-gray-700 flex-1 truncate">{f.name}</span>
                <span className="text-[10px] text-gray-400 shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            <button
              className="btn btn-primary w-full mt-2"
              onClick={(e) => { e.stopPropagation(); onStart(selected) }}
            >
              <Sparkles size={14} />
              Proses {selected.length} Dokumen
            </button>
          </div>
        )}
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
function PhaseProcessing({ documents }) {
  const done = documents.filter(d => d.status === 'done' || d.status === 'error').length
  const total = documents.length
  const pct = total > 0 ? (done / total) * 100 : 0

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">Memproses {total} Dokumen...</p>
          <p className="text-xs text-gray-500">{done} dari {total} selesai</p>
        </div>
        <div className="w-40 bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-brand-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {documents.map(doc => (
          <div key={doc.id} className="card flex items-start gap-4 py-3">
            <FileText size={18} className={`shrink-0 mt-0.5 ${doc.status === 'error' ? 'text-red-400' : 'text-brand-400'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{doc.fileName}</p>
              {doc.status === 'error' ? (
                <p className="text-xs text-red-500 mt-1">{doc.error}</p>
              ) : (
                <div className="flex flex-col gap-1.5 mt-2">
                  {OCR_STEPS.map((s, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-[12px] transition-colors
                        ${doc.step > i ? 'text-brand-600' : doc.step === i ? 'text-gray-800 font-medium' : 'text-gray-400'}`}
                    >
                      <div className="w-4 h-4 rounded-full border-[1.5px] border-current flex items-center justify-center shrink-0">
                        {doc.step > i
                          ? <Check size={8} />
                          : doc.step === i
                          ? <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          : null}
                      </div>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 pt-0.5">
              {doc.status === 'done' && <span className="badge badge-green text-[10px]">Selesai</span>}
              {doc.status === 'error' && <span className="badge badge-red text-[10px]">Error</span>}
              {doc.status === 'processing' && (
                <div className="w-5 h-5 border-2 border-gray-100 border-t-brand-400 rounded-full animate-spin" />
              )}
              {doc.status === 'queued' && <span className="text-[10px] text-gray-400">Antri</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Single Document Review Card ──────────────────────────────────────────────
function DocReviewCard({ doc, onUpdate, isSaved }) {
  const [expanded, setExpanded] = useState(true)

  const AutoInput = ({ field, type = 'text', conf }) => (
    <input
      type={type}
      className={`form-input${conf !== undefined ? ' auto-filled' : ''}`}
      value={doc.formData[field] ?? ''}
      onChange={(e) => onUpdate(doc.id, field, e.target.value)}
      disabled={isSaved}
    />
  )

  const ReadOnly = ({ field, highlight }) => (
    <div className={`form-input readonly flex items-center min-h-[38px] ${highlight ? 'font-semibold text-brand-600' : ''}`}>
      {doc.formData[field] ?? '—'}
    </div>
  )

  const c = doc.formData.confidence ?? {}

  return (
    <div className={`card mb-4 transition-opacity ${isSaved ? 'opacity-60' : ''}`}>
      <button
        className="flex items-center gap-3 w-full text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <FileText size={16} className={doc.status === 'error' ? 'text-red-400' : 'text-brand-400'} />
        <span className="text-sm font-semibold flex-1 truncate">{doc.fileName}</span>
        {isSaved
          ? <span className="badge badge-green text-[10px]">Tersimpan</span>
          : doc.status === 'error'
          ? <span className="badge badge-red text-[10px]">Error</span>
          : <span className="badge badge-blue text-[10px]">Perlu Ditinjau</span>}
        <span className="text-gray-400 text-xs ml-1">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && doc.status === 'error' && (
        <p className="mt-3 text-xs text-red-500">{doc.error}</p>
      )}

      {expanded && isSaved && (
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
          <CheckCircle2 size={13} className="text-brand-400" />
          Metadata tersimpan — {doc.formData.title}
        </div>
      )}

      {expanded && !isSaved && doc.status === 'done' && (
        <div className="mt-4">
          {doc.formData.klasifikasiError && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs flex items-start gap-2">
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              {doc.formData.klasifikasiError}
            </div>
          )}

          <p className="text-xs font-semibold text-gray-500 mb-3">Informasi Dokumen</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
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
              <select
                className="form-input auto-filled"
                value={doc.formData.sifat_dokumen ?? ''}
                onChange={(e) => onUpdate(doc.id, 'sifat_dokumen', e.target.value)}
              >
                {['Biasa', 'Terbatas', 'Rahasia', 'Terbuka'].map(v => <option key={v}>{v}</option>)}
              </select>
            </FormField>
            <FormField label="Perihal / Tentang" conf={c.tentang}>
              <AutoInput field="tentang" conf={c.tentang} />
            </FormField>
            <FormField label="Deskripsi" conf={c.description}>
              <AutoInput field="description" conf={c.description} />
            </FormField>
            <FormField label="Konteks" conf={c.konteks} full>
              <textarea
                className="form-input auto-filled resize-y"
                rows={2}
                value={doc.formData.konteks ?? ''}
                onChange={(e) => onUpdate(doc.id, 'konteks', e.target.value)}
              />
            </FormField>
          </div>

          <p className="text-xs font-semibold text-gray-500 mb-3">Klasifikasi Otomatis</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Kode Sub-Kategori"><ReadOnly field="code_SC" /></FormField>
            <FormField label="Sub-Kategori"><ReadOnly field="sc_name" /></FormField>
            <FormField label="Kategori Utama"><ReadOnly field="mc" /></FormField>
            <FormField label="Masa Retensi">
              <div className="form-input readonly flex items-center min-h-[38px]">{doc.formData.retention} Tahun</div>
            </FormField>
            <FormField label="Tahun Retensi"><ReadOnly field="tahun_retensi" highlight /></FormField>
            <FormField label="Status"><ReadOnly field="status" highlight /></FormField>
            <FormField label="Hak Akses">
              <select
                className="form-input"
                value={doc.formData.hak_akses ?? ''}
                onChange={(e) => onUpdate(doc.id, 'hak_akses', e.target.value)}
              >
                <option value="">Pilih hak akses</option>
                {ACCESS_GROUPS.map(g => (
                  <option key={g.code} value={g.code}>{g.code} — {g.label} ({g.level})</option>
                ))}
              </select>
            </FormField>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Review Phase ─────────────────────────────────────────────────────────────
function PhaseReview({ documents, onUpdate, onSaveAll, onReset, saveErrors, savedIds, saving }) {
  const reviewable = documents.filter(d => d.status === 'done' && !savedIds.has(d.id))
  const errorCount = documents.filter(d => d.status === 'error').length

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">{documents.length} Dokumen Diproses</p>
          <p className="text-xs text-gray-500">
            {savedIds.size} tersimpan · {reviewable.length} perlu ditinjau
            {errorCount > 0 && ` · ${errorCount} gagal`}
          </p>
        </div>
        <button className="btn btn-sm" onClick={onReset}>
          <ArrowLeft size={13} /> Upload Lagi
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={onSaveAll}
          disabled={reviewable.length === 0 || saving}
        >
          <Save size={13} />
          {saving ? 'Menyimpan...' : `Simpan Semua (${reviewable.length})`}
        </button>
      </div>

      {Object.keys(saveErrors).length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs space-y-1">
          {Object.entries(saveErrors).map(([id, err]) => (
            <div key={id} className="flex items-center gap-2">
              <AlertCircle size={11} className="shrink-0" />
              <span className="font-medium">{documents.find(d => d.id === id)?.fileName}:</span> {err}
            </div>
          ))}
        </div>
      )}

      {documents.map(doc => (
        <DocReviewCard
          key={doc.id}
          doc={doc}
          onUpdate={onUpdate}
          isSaved={savedIds.has(doc.id)}
        />
      ))}
    </div>
  )
}

// ─── Success Phase ────────────────────────────────────────────────────────────
function PhaseSaved({ documents, savedIds, onReset }) {
  const saved = documents.filter(d => savedIds.has(d.id))
  const failed = documents.filter(d => d.status === 'error')

  return (
    <div className="max-w-md mx-auto text-center pt-10">
      <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={36} className="text-brand-400" />
      </div>
      <p className="text-lg font-bold text-gray-900">{saved.length} Metadata Tersimpan!</p>
      <p className="text-sm text-gray-500 mt-1.5">
        Dokumen berhasil diklasifikasikan dan disimpan ke arsip.
        {failed.length > 0 && ` ${failed.length} dokumen gagal diproses.`}
      </p>

      <div className="card mt-5 text-left text-sm">
        {saved.map(doc => (
          <div key={doc.id} className="py-2.5 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2 mb-0.5">
              <CheckCircle2 size={12} className="text-brand-400 shrink-0" />
              <span className="text-xs font-semibold text-gray-700 truncate">{doc.formData.title}</span>
            </div>
            <p className="text-[11px] text-gray-400 pl-4">
              {doc.formData.nomor_dokumen} · {doc.formData.code_SC}
            </p>
          </div>
        ))}
        {failed.map(doc => (
          <div key={doc.id} className="py-2.5 flex items-center gap-2 border-b border-gray-50 last:border-0">
            <AlertCircle size={12} className="text-red-400 shrink-0" />
            <span className="text-xs text-red-500 truncate">{doc.fileName}: {doc.error}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary mt-5" onClick={onReset}>
        <Upload size={14} /> Upload Dokumen Lain
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AutoMetadata() {
  const [phase, setPhase] = useState('upload')
  const [documents, setDocuments] = useState([])
  const [savedIds, setSavedIds] = useState(new Set())
  const [saveErrors, setSaveErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const updateDoc = (id, patch) =>
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d))

  const updateDocField = (id, field, value) =>
    setDocuments(prev => prev.map(d =>
      d.id === id ? { ...d, formData: { ...d.formData, [field]: value } } : d
    ))

  const startProcessing = async (files) => {
    const docs = files.map((file, i) => ({
      id: `doc-${Date.now()}-${i}`,
      file,
      fileName: file.name,
      status: 'queued',
      step: 0,
      formData: {},
      error: null,
    }))

    setDocuments(docs)
    setSavedIds(new Set())
    setSaveErrors({})
    setPhase('processing')

    // Pass updateDoc as argument to avoid stale closure issues
    const update = (id, patch) =>
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d))

    await Promise.all(docs.map(doc => runOcrPipeline(doc, update)))
    setPhase('review')
  }

  const handleSaveAll = async () => {
    const toSave = documents.filter(d => d.status === 'done' && !savedIds.has(d.id))
    setSaving(true)

    const errors = {}
    const newlySaved = new Set()

    await Promise.all(toSave.map(async (doc) => {
      if (!doc.formData.nomor_dokumen || !doc.formData.title) {
        errors[doc.id] = 'Nomor dokumen dan judul wajib diisi'
        return
      }
      if (documentExists(doc.formData.nomor_dokumen)) {
        errors[doc.id] = 'Dokumen dengan nomor ini sudah ada'
        return
      }
      try {
        await saveDocument({
          title: doc.formData.title,
          nomor: doc.formData.nomor_dokumen,
          tanggal: doc.formData.tanggal_dokumen,
          unit: doc.formData.unit_pengolah,
          sifat: doc.formData.sifat_dokumen,
          tentang: doc.formData.tentang,
          description: doc.formData.description,
          konteks: doc.formData.konteks,
          mc: doc.formData.code_MC,
          sc: doc.formData.code_SC,
          retensi: doc.formData.tahun_retensi,
          status: doc.formData.status,
          file_type: doc.file?.name.split('.').pop().toUpperCase(),
          hak_akses: doc.formData.hak_akses,
        })
        newlySaved.add(doc.id)
      } catch (err) {
        errors[doc.id] = 'Gagal menyimpan: ' + err.message
      }
    }))

    setSavedIds(prev => new Set([...prev, ...newlySaved]))
    setSaveErrors(errors)
    setSaving(false)

    if (newlySaved.size > 0 && Object.keys(errors).length === 0) {
      setPhase('saved')
    }
  }

  const reset = () => {
    setPhase('upload')
    setDocuments([])
    setSavedIds(new Set())
    setSaveErrors({})
    setSaving(false)
  }

  return (
    <div className="p-7">
      {phase === 'upload' && <PhaseUpload onStart={startProcessing} />}
      {phase === 'processing' && <PhaseProcessing documents={documents} />}
      {phase === 'review' && (
        <PhaseReview
          documents={documents}
          onUpdate={updateDocField}
          onSaveAll={handleSaveAll}
          onReset={reset}
          saveErrors={saveErrors}
          savedIds={savedIds}
          saving={saving}
        />
      )}
      {phase === 'saved' && (
        <PhaseSaved documents={documents} savedIds={savedIds} onReset={reset} />
      )}
    </div>
  )
}
