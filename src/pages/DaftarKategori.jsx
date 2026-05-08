/**
 * src/pages/DaftarKategori.jsx
 * Halaman Kosakata Kategori — Standard Category Vocabularies
 * Stack: React + TailwindCSS + shadcn/ui
 * Auth: diabaikan untuk sementara (semua aksi tersedia)
 */

import { useState } from 'react'
import {
  mainCategories as initialMain,
  subCategories as initialSub,
  getSubByMC,
} from '../data/mockKategori'

// ─── shadcn/ui primitives (pastikan sudah di-install) ─────────────────────────

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// ─── Icons (lucide-react) ─────────────────────────────────────────────────────
import {
  Plus,
  Pencil,
  FileText,
  ChevronRight,
  X,
  Trash2,
  Download,
  Eye,
  FolderOpen,
  Search,
  Info,
} from 'lucide-react'

// ─── Mock dokumen terkait (ganti dengan API call nanti) ───────────────────────
const mockDokumen = [
  {
    id: '1',
    title: 'Laporan Pengadaan Server 2023',
    nomor_dokumen: '001/KU.01/IV/2023',
    tanggal_dokumen: '2023-04-10',
    code_MC: 'KU',
    code_SC: 'KU.01',
    tahun_retensi: 2033,
    sifat_dokumen: 'Biasa',
    unit_pengolah: 'Divisi Keuangan',
    description: 'Laporan lengkap pengadaan server untuk kebutuhan infrastruktur 2023.',
    tentang: 'Pengadaan server rack 4U untuk data center lantai 3.',
    konteks: 'Bagian dari program digitalisasi 2023-2025.',
  },
  {
    id: '2',
    title: 'Kontrak Audit Eksternal 2024',
    nomor_dokumen: '012/KU.02/I/2024',
    tanggal_dokumen: '2024-01-15',
    code_MC: 'KU',
    code_SC: 'KU.02',
    tahun_retensi: 2024,
    sifat_dokumen: 'Rahasia',
    unit_pengolah: 'Divisi Keuangan',
    description: 'Kontrak kerja sama audit eksternal dengan KAP Pratama.',
    tentang: 'Audit laporan keuangan tahunan 2023.',
    konteks: 'Wajib sesuai regulasi OJK.',
  },
  {
    id: '3',
    title: 'SK Direksi No. 005/2022',
    nomor_dokumen: '005/HK.01/II/2022',
    tanggal_dokumen: '2022-02-01',
    code_MC: 'HK',
    code_SC: 'HK.01',
    tahun_retensi: 2052,
    sifat_dokumen: 'Terbatas',
    unit_pengolah: 'Divisi Hukum',
    description: 'Surat Keputusan Direksi tentang struktur organisasi baru.',
    tentang: 'Restrukturisasi divisi operasional.',
    konteks: 'Berlaku mulai 1 Maret 2022.',
  },
  {
    id: '4',
    title: 'Data Kepegawaian 2020',
    nomor_dokumen: '089/SDM.04/XII/2020',
    tanggal_dokumen: '2020-12-01',
    code_MC: 'SDM',
    code_SC: 'SDM.04',
    tahun_retensi: 2025,
    sifat_dokumen: 'Rahasia',
    unit_pengolah: 'Divisi SDM',
    description: 'Berkas file 201 seluruh pegawai aktif per Desember 2020.',
    tentang: 'Kompilasi data kepegawaian akhir tahun.',
    konteks: 'Arsip tahunan wajib SDM.',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CURRENT_YEAR = new Date().getFullYear()

function isNearExpiry(tahun_retensi) {
  return tahun_retensi - CURRENT_YEAR <= 0.5
}

function formatTanggal(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// ─── Sub-komponen kecil ───────────────────────────────────────────────────────

function SifatBadge({ sifat }) {
  const map = {
    Rahasia: 'bg-red-100 text-red-700 border-red-200',
    Terbatas: 'bg-orange-100 text-orange-700 border-orange-200',
    Biasa: 'bg-green-100 text-green-700 border-green-200',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
        map[sifat] ?? 'bg-gray-100 text-gray-600 border-gray-200'
      }`}
    >
      {sifat}
    </span>
  )
}

function RetensiBadge({ tahun }) {
  const near = isNearExpiry(tahun)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        near
          ? 'bg-red-50 text-red-600 border border-red-200'
          : 'bg-slate-100 text-slate-600 border border-slate-200'
      }`}
    >
      {near && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
      {tahun}
    </span>
  )
}

// ─── Modal: Tambah / Edit Kategori Utama ──────────────────────────────────────
function ModalKategoriUtama({ open, onClose, onSave, initialData = null }) {
  const isEdit = !!initialData
  const [form, setForm] = useState(
    initialData ?? { code_MC: '', name_MC: '', desc_MC: '' }
  )
  const [subForms, setSubForms] = useState([])
  const [errors, setErrors] = useState({})

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const addSubForm = () =>
    setSubForms((prev) => [
      ...prev,
      { code_SC: '', name_SC: '', desc_SC: '', retention: '' },
    ])

  const setSubField = (i, key, val) =>
    setSubForms((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)))

  const removeSubForm = (i) => setSubForms((prev) => prev.filter((_, idx) => idx !== i))

  const validate = () => {
    const e = {}
    if (!form.code_MC.trim()) e.code_MC = 'Kode wajib diisi'
    if (!form.name_MC.trim()) e.name_MC = 'Nama wajib diisi'
    subForms.forEach((s, i) => {
      if (!s.code_SC.trim()) e[`sc_code_${i}`] = 'Kode wajib diisi'
      if (!s.name_SC.trim()) e[`sc_name_${i}`] = 'Nama wajib diisi'
      if (!s.retention || Number(s.retention) <= 0)
        e[`sc_ret_${i}`] = 'Retensi harus > 0'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({ form, subForms })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? 'Edit Kategori Utama' : 'Tambah Kategori Utama'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Kode */}
          <div className="space-y-1">
            <Label>
              Kode Kategori <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.code_MC}
              onChange={(e) => set('code_MC', e.target.value.toUpperCase())}
              placeholder="cth: KU"
              disabled={isEdit}
              className={errors.code_MC ? 'border-red-400' : ''}
            />
            {errors.code_MC && (
              <p className="text-xs text-red-500">{errors.code_MC}</p>
            )}
            {isEdit && (
              <p className="text-xs text-muted-foreground">
                Kode tidak dapat diubah jika sudah ada dokumen terkait.
              </p>
            )}
          </div>

          {/* Nama */}
          <div className="space-y-1">
            <Label>
              Nama Kategori <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.name_MC}
              onChange={(e) => set('name_MC', e.target.value)}
              placeholder="cth: Keuangan"
              className={errors.name_MC ? 'border-red-400' : ''}
            />
            {errors.name_MC && (
              <p className="text-xs text-red-500">{errors.name_MC}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="space-y-1">
            <Label>Deskripsi</Label>
            <Textarea
              value={form.desc_MC}
              onChange={(e) => set('desc_MC', e.target.value)}
              placeholder="Deskripsi singkat kategori ini..."
              rows={3}
            />
          </div>

          {/* Sub-kategori inline (hanya saat tambah baru) */}
          {!isEdit && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">
                    Sub-kategori (opsional)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSubForm}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    Tambah Sub-kategori
                  </Button>
                </div>

                {subForms.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-dashed border-slate-300 p-4 space-y-3 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Sub-kategori #{i + 1}
                      </p>
                      <button
                        onClick={() => removeSubForm(i)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">
                          Kode Sub <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={s.code_SC}
                          onChange={(e) =>
                            setSubField(i, 'code_SC', e.target.value.toUpperCase())
                          }
                          placeholder={`${form.code_MC || 'XX'}.01`}
                          className={`text-sm ${errors[`sc_code_${i}`] ? 'border-red-400' : ''}`}
                        />
                        {errors[`sc_code_${i}`] && (
                          <p className="text-xs text-red-500">{errors[`sc_code_${i}`]}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">
                          Retensi (tahun) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          value={s.retention}
                          onChange={(e) => setSubField(i, 'retention', e.target.value)}
                          placeholder="10"
                          min={1}
                          className={`text-sm ${errors[`sc_ret_${i}`] ? 'border-red-400' : ''}`}
                        />
                        {errors[`sc_ret_${i}`] && (
                          <p className="text-xs text-red-500">{errors[`sc_ret_${i}`]}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">
                        Nama Sub-kategori <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={s.name_SC}
                        onChange={(e) => setSubField(i, 'name_SC', e.target.value)}
                        placeholder="cth: Pengadaan Barang & Jasa"
                        className={`text-sm ${errors[`sc_name_${i}`] ? 'border-red-400' : ''}`}
                      />
                      {errors[`sc_name_${i}`] && (
                        <p className="text-xs text-red-500">{errors[`sc_name_${i}`]}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Deskripsi</Label>
                      <Textarea
                        value={s.desc_SC}
                        onChange={(e) => setSubField(i, 'desc_SC', e.target.value)}
                        placeholder="Deskripsi sub-kategori..."
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={handleSave}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah Kategori'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Modal: Tambah / Edit Sub-kategori ───────────────────────────────────────
function ModalSubKategori({ open, onClose, onSave, parentMC, initialData = null }) {
  const isEdit = !!initialData
  const [form, setForm] = useState(
    initialData ?? { code_SC: '', name_SC: '', desc_SC: '', retention: '' }
  )
  const [errors, setErrors] = useState({})

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.code_SC.trim()) e.code_SC = 'Kode wajib diisi'
    if (!form.name_SC.trim()) e.name_SC = 'Nama wajib diisi'
    if (!form.retention || Number(form.retention) <= 0)
      e.retention = 'Retensi harus berupa angka positif'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({ ...form, code_MC: parentMC, retention: Number(form.retention) })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? 'Edit Sub-kategori' : 'Tambah Sub-kategori'}
          </DialogTitle>
          {parentMC && (
            <p className="text-sm text-muted-foreground">
              Kategori Utama:{' '}
              <span className="font-medium text-slate-700">{parentMC}</span>
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>
                Kode Sub <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.code_SC}
                onChange={(e) => set('code_SC', e.target.value.toUpperCase())}
                placeholder={`${parentMC}.01`}
                disabled={isEdit}
                className={errors.code_SC ? 'border-red-400' : ''}
              />
              {errors.code_SC && (
                <p className="text-xs text-red-500">{errors.code_SC}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>
                Retensi (tahun) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={form.retention}
                onChange={(e) => set('retention', e.target.value)}
                placeholder="10"
                min={1}
                className={errors.retention ? 'border-red-400' : ''}
              />
              {errors.retention && (
                <p className="text-xs text-red-500">{errors.retention}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label>
              Nama Sub-kategori <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.name_SC}
              onChange={(e) => set('name_SC', e.target.value)}
              placeholder="cth: Pengadaan Barang & Jasa"
              className={errors.name_SC ? 'border-red-400' : ''}
            />
            {errors.name_SC && (
              <p className="text-xs text-red-500">{errors.name_SC}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Deskripsi</Label>
            <Textarea
              value={form.desc_SC}
              onChange={(e) => set('desc_SC', e.target.value)}
              placeholder="Deskripsi sub-kategori ini..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={handleSave}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah Sub-kategori'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Panel: Dokumen Terkait ───────────────────────────────────────────────────
function PanelDokumenTerkait({ filterMC, filterSC, onClose }) {
  const [selectedDoc, setSelectedDoc] = useState(null)

  const dokumen = mockDokumen.filter((d) =>
    filterSC ? d.code_SC === filterSC : d.code_MC === filterMC
  )

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="w-full max-w-5xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div>
            <h2 className="font-semibold text-slate-800">Dokumen Terkait</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filterSC
                ? `Sub-kategori: ${filterSC}`
                : `Kategori Utama: ${filterMC}`}{' '}
              — {dokumen.length} dokumen
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Kiri: Daftar dokumen */}
          <div className="w-80 border-r border-slate-200 overflow-y-auto flex-shrink-0">
            {dokumen.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
                <FolderOpen className="h-10 w-10 text-slate-300" />
                <p className="text-sm text-slate-400">
                  Belum ada dokumen untuk kategori ini.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {dokumen.map((doc) => (
                  <li key={doc.id}>
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${
                        selectedDoc?.id === doc.id
                          ? 'bg-blue-50 border-r-2 border-blue-500'
                          : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-800 line-clamp-1 mb-1">
                        {doc.title}
                      </p>
                      <p className="text-xs text-slate-500 font-mono mb-1.5">
                        {doc.nomor_dokumen}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {formatTanggal(doc.tanggal_dokumen)}
                        </span>
                        <RetensiBadge tahun={doc.tahun_retensi} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Kanan: Detail dokumen */}
          <div className="flex-1 overflow-y-auto">
            {!selectedDoc ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
                <FileText className="h-10 w-10 text-slate-300" />
                <p className="text-sm text-slate-400">
                  Pilih dokumen di sebelah kiri untuk melihat detail.
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Judul & aksi */}
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    {selectedDoc.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    {selectedDoc.nomor_dokumen}
                  </p>
                </div>

                {/* Tombol aksi */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Download className="h-3.5 w-3.5" />
                    Unduh
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    Baca
                  </Button>
                  {isNearExpiry(selectedDoc.tahun_retensi) && (
                    <>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Musnahkan
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Pertahankan (Abadi)
                      </Button>
                    </>
                  )}
                </div>

                <Separator />

                {/* Metadata fields */}
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  {[
                    ['Unit Pengolah', selectedDoc.unit_pengolah],
                    ['Tanggal Dokumen', formatTanggal(selectedDoc.tanggal_dokumen)],
                    ['Tahun Retensi', selectedDoc.tahun_retensi],
                    ['Sifat Dokumen', null],
                    ['Kategori Utama', selectedDoc.code_MC],
                    ['Sub-kategori', selectedDoc.code_SC],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                        {label}
                      </dt>
                      <dd className="text-slate-800">
                        {label === 'Sifat Dokumen' ? (
                          <SifatBadge sifat={selectedDoc.sifat_dokumen} />
                        ) : label === 'Tahun Retensi' ? (
                          <RetensiBadge tahun={val} />
                        ) : (
                          val || '-'
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                <Separator />

                <div className="space-y-4 text-sm">
                  {[
                    ['Perihal', selectedDoc.tentang],
                    ['Deskripsi', selectedDoc.description],
                    ['Konteks', selectedDoc.konteks],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        {label}
                      </p>
                      <p className="text-slate-700 leading-relaxed">{val || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────
export default function DaftarKategori() {
  const [mainCats, setMainCats] = useState(initialMain)
  const [subCats, setSubCats] = useState(initialSub)

  const [selectedMC, setSelectedMC] = useState(mainCats[0] ?? null)
  const [search, setSearch] = useState('')

  // Modal states
  const [modalAddMC, setModalAddMC] = useState(false)
  const [modalEditMC, setModalEditMC] = useState(false)
  const [modalAddSC, setModalAddSC] = useState(false)
  const [modalEditSC, setModalEditSC] = useState(null) // sub object or null

  // Dokumen terkait
  const [dokumenFilter, setDokumenFilter] = useState(null) // { filterMC, filterSC }

  // Computed
  const filteredMC = mainCats.filter(
    (mc) =>
      mc.name_MC.toLowerCase().includes(search.toLowerCase()) ||
      mc.code_MC.toLowerCase().includes(search.toLowerCase())
  )

  const activeSubs = subCats.filter((sc) => sc.code_MC === selectedMC?.code_MC)

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAddMC = ({ form, subForms }) => {
    const newMC = { ...form }
    setMainCats((prev) => [...prev, newMC])
    const newSubs = subForms.map((s) => ({
      ...s,
      code_MC: form.code_MC,
      retention: Number(s.retention),
    }))
    setSubCats((prev) => [...prev, ...newSubs])
    setSelectedMC(newMC)
  }

  const handleEditMC = ({ form }) => {
    setMainCats((prev) =>
      prev.map((mc) => (mc.code_MC === form.code_MC ? { ...mc, ...form } : mc))
    )
    setSelectedMC((prev) => (prev?.code_MC === form.code_MC ? { ...prev, ...form } : prev))
  }

  const handleAddSC = (data) => {
    setSubCats((prev) => [...prev, data])
  }

  const handleEditSC = (data) => {
    setSubCats((prev) =>
      prev.map((sc) => (sc.code_SC === data.code_SC ? { ...sc, ...data } : sc))
    )
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* ── Left panel ──────────────────────────────────────────────────── */}
        <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
          {/* Header panel kiri */}
          <div className="px-4 pt-5 pb-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">
                Kosakata Kategori
              </h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => setModalAddMC(true)}
                    className="h-7 w-7 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tambah Kategori Utama</TooltipContent>
              </Tooltip>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kategori..."
                className="pl-8 h-8 text-sm bg-slate-50 border-slate-200"
              />
            </div>

            <p className="text-xs text-slate-400">
              {filteredMC.length} kategori ditemukan
            </p>
          </div>

          {/* List */}
          <ul className="flex-1 overflow-y-auto py-2">
            {filteredMC.map((mc) => {
              const count = subCats.filter((sc) => sc.code_MC === mc.code_MC).length
              const isActive = selectedMC?.code_MC === mc.code_MC
              return (
                <li key={mc.code_MC}>
                  <button
                    onClick={() => setSelectedMC(mc)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors group hover:bg-slate-50 ${
                      isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-bold font-mono tracking-wider ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      {mc.code_MC}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium leading-snug truncate ${
                          isActive ? 'text-blue-800' : 'text-slate-700'
                        }`}
                      >
                        {mc.name_MC}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {count} sub-kategori
                      </p>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 flex-shrink-0 mt-0.5 transition-transform ${
                        isActive ? 'text-blue-400 rotate-90' : 'text-slate-300'
                      }`}
                    />
                  </button>
                </li>
              )
            })}

            {filteredMC.length === 0 && (
              <li className="flex flex-col items-center justify-center py-10 gap-2 text-center px-4">
                <Search className="h-7 w-7 text-slate-300" />
                <p className="text-sm text-slate-400">Kategori tidak ditemukan.</p>
              </li>
            )}
          </ul>
        </aside>

        {/* ── Right panel ─────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6">
          {!selectedMC ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <FolderOpen className="h-12 w-12 text-slate-300" />
              <p className="text-slate-400 text-sm">
                Pilih kategori di sebelah kiri.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl space-y-6">
              {/* ── Info kategori utama ── */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-blue-50 px-3 py-1.5 text-blue-700 font-bold font-mono text-lg tracking-wide border border-blue-100">
                      {selectedMC.code_MC}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {selectedMC.name_MC}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed max-w-xl">
                        {selectedMC.desc_MC || (
                          <span className="italic">Belum ada deskripsi.</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Aksi kategori utama */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => setModalEditMC(true)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Kategori Utama</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() =>
                            setDokumenFilter({
                              filterMC: selectedMC.code_MC,
                              filterSC: null,
                            })
                          }
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Dokumen Terkait
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Lihat semua dokumen dalam kategori ini</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* ── Sub-kategori ── */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Sub-kategori
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activeSubs.length} sub-kategori terdaftar
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => setModalAddSC(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Sub-kategori
                  </Button>
                </div>

                {activeSubs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                    <FolderOpen className="h-9 w-9 text-slate-300" />
                    <p className="text-sm text-slate-400">
                      Belum ada sub-kategori. Klik "+ Tambah Sub-kategori" untuk mulai.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                        <TableHead className="w-24 text-xs font-semibold text-slate-500">
                          Kode
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500">
                          Nama Sub-kategori
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 w-28 text-center">
                          Retensi
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 text-right w-40">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeSubs.map((sc) => (
                        <TableRow
                          key={sc.code_SC}
                          className="group hover:bg-slate-50/80"
                        >
                          <TableCell>
                            <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 rounded px-1.5 py-0.5">
                              {sc.code_SC}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {sc.name_SC}
                              </p>
                              {sc.desc_SC && (
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                  {sc.desc_SC}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm font-medium text-slate-700">
                              {sc.retention}{' '}
                              <span className="text-xs font-normal text-slate-400">
                                thn
                              </span>
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setModalEditSC(sc)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Sub-kategori</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 hover:text-blue-600"
                                    onClick={() =>
                                      setDokumenFilter({
                                        filterMC: sc.code_MC,
                                        filterSC: sc.code_SC,
                                      })
                                    }
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Dokumen Terkait</TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}

      {/* Tambah Kategori Utama */}
      <ModalKategoriUtama
        open={modalAddMC}
        onClose={() => setModalAddMC(false)}
        onSave={handleAddMC}
      />

      {/* Edit Kategori Utama */}
      {modalEditMC && selectedMC && (
        <ModalKategoriUtama
          open={modalEditMC}
          onClose={() => setModalEditMC(false)}
          onSave={handleEditMC}
          initialData={{ ...selectedMC }}
        />
      )}

      {/* Tambah Sub-kategori */}
      <ModalSubKategori
        open={modalAddSC}
        onClose={() => setModalAddSC(false)}
        onSave={handleAddSC}
        parentMC={selectedMC?.code_MC}
      />

      {/* Edit Sub-kategori */}
      {modalEditSC && (
        <ModalSubKategori
          open={!!modalEditSC}
          onClose={() => setModalEditSC(null)}
          onSave={handleEditSC}
          parentMC={modalEditSC.code_MC}
          initialData={{ ...modalEditSC }}
        />
      )}

      {/* Panel Dokumen Terkait */}
      {dokumenFilter && (
        <PanelDokumenTerkait
          filterMC={dokumenFilter.filterMC}
          filterSC={dokumenFilter.filterSC}
          onClose={() => setDokumenFilter(null)}
        />
      )}
    </TooltipProvider>
  )
}
