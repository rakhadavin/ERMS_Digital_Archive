import { useState, useMemo } from 'react'
import { BellRing, ShieldCheck, Flame, AlertTriangle } from 'lucide-react'
import { mockNotifikasiRetensi } from '../data/mockData.js'
import { Badge, Modal, EmptyState } from '../components/ui.jsx'
import {
  getUrgensiRetensi,
  hitungSisaBulan,
  formatSisaRetensi,
  hitungPersenUrgensi,
  getLabelUrgensi,
  getWarnaBadgeRetensi,
} from '../utils/hitungRetensi.js'

const TABS = [
  { id: 'semua',        label: 'Semua' },
  { id: 'belum',        label: 'Belum Ditangani' },
  { id: 'pertahankan',  label: 'Dipertahankan' },
  { id: 'musnahkan',    label: 'Dimusnahkan' },
]

function UrgencyBar({ bulanSisa }) {
  const pct = Math.round(((6 - bulanSisa) / 6) * 100)
  const color =
    bulanSisa <= 2 ? '#E24B4A' : bulanSisa <= 4 ? '#EF9F27' : '#1D9E75'
  return (
    <div>
      <p className="text-xs font-semibold mb-1" style={{ color }}>
        {bulanSisa} bulan
      </p>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden w-24">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

function ConfirmModal({ item, type, onConfirm, onClose }) {
  const isMusnahkan = type === 'musnahkan'
  return (
    <Modal onClose={onClose}>
      <p className="text-base font-bold text-gray-900">
        {isMusnahkan ? 'Konfirmasi Pemusnahan' : 'Konfirmasi Pertahankan Permanen'}
      </p>
      <p className="text-sm text-gray-500 mt-1">{item.title}</p>
      <hr className="my-4 border-gray-100" />

      <div
        className={`rounded-lg p-3 mb-4 ${
          isMusnahkan ? 'bg-red-50 text-red-700' : 'bg-brand-50 text-brand-600'
        }`}
      >
        <p className="text-xs font-semibold flex items-center gap-1.5">
          {isMusnahkan ? (
            <><AlertTriangle size={13} />Tindakan ini tidak dapat dibatalkan</>
          ) : (
            <><ShieldCheck size={13} />Dokumen akan disimpan permanen</>
          )}
        </p>
        <p className="text-xs mt-1 opacity-80">
          {isMusnahkan
            ? 'Dokumen akan ditandai untuk dimusnahkan sesuai prosedur.'
            : 'Masa retensi tidak akan berlaku. Dokumen dipertahankan selamanya.'}
        </p>
      </div>

      <div className="text-sm text-gray-700 space-y-1.5 mb-5">
        {[
          ['Nomor', item.nomor],
          ['Unit', item.unit],
          ['Tahun Retensi', item.retensi],
          ['Batas Retensi', item.deadline],
          ['Sisa Waktu', item.labelSisa],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <span className="text-gray-400 w-24 shrink-0">{k}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <button className="btn" onClick={onClose}>Batal</button>
        <button
          className={`btn ${isMusnahkan ? 'btn-danger' : 'btn-primary'}`}
          onClick={onConfirm}
        >
          {isMusnahkan ? (
            <><Flame size={14} />Ya, Musnahkan</>
          ) : (
            <><ShieldCheck size={14} />Ya, Pertahankan</>
          )}
        </button>
      </div>
    </Modal>
  )
}

export default function Notifikasi() {
  const [items, setItems] = useState(mockNotifikasiRetensi.map((n) => ({ ...n })))
  const [filter, setFilter] = useState('semua')
  const [selected, setSelected] = useState(null)
  const [modalType, setModalType] = useState(null)

  const now = new Date()
  const enrichedItems = useMemo(
    () =>
      items.map((item) => {
        const sisaBulan = hitungSisaBulan(item.retensi, now)
        const urgensi = getUrgensiRetensi(item.retensi, now)
        return {
          ...item,
          sisaBulan,
          urgencyLabel: getLabelUrgensi(urgensi),
          urgencyBadge: getWarnaBadgeRetensi(urgensi),
          labelSisa: formatSisaRetensi(item.retensi, now),
          persenUrgensi: hitungPersenUrgensi(sisaBulan),
          deadline: `31 Desember ${item.retensi}`,
        }
      }),
    [items, now]
  )

  const filtered = useMemo(() => {
    if (filter === 'semua') return enrichedItems
    if (filter === 'belum') return enrichedItems.filter((n) => !n.tindakan)
    return enrichedItems.filter((n) => n.tindakan === filter)
  }, [enrichedItems, filter])

  const belumCount = enrichedItems.filter((n) => !n.tindakan).length

  const handleAction = (id, type) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, tindakan: type } : n))
    )
    setModalType(null)
    setSelected(null)
  }

  return (
    <div className="p-7">
      {/* Modal */}
      {modalType && selected && (
        <ConfirmModal
          item={selected}
          type={modalType}
          onConfirm={() => handleAction(selected.id, modalType)}
          onClose={() => { setModalType(null); setSelected(null) }}
        />
      )}

      {/* Banner */}
      <div className="card flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
          <BellRing size={18} className="text-red-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Peringatan Retensi Aktif</p>
          <p className="text-xs text-gray-500">
            {belumCount} dokumen belum diambil tindakan · Jadwal cek: setiap 2 minggu
          </p>
        </div>
        <p className="text-xs text-gray-400">Terakhir diperbarui: 1 Mei 2026</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-5">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all
              ${filter === id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setFilter(id)}
          >
            {label}
            {id === 'belum' && belumCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                {belumCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Judul Dokumen', 'Nomor / Unit', 'Sisa Waktu', 'Status', 'Tindakan'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState
                    icon="✅"
                    title="Tidak ada dokumen di kategori ini"
                    desc="Semua dokumen sudah ditangani"
                  />
                </td>
              </tr>
            ) : (
              filtered.map((n) => (
                <tr key={n.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-[13px] font-medium text-gray-800 truncate">{n.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Retensi: {n.retensi}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-mono text-gray-700">{n.nomor}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{n.unit}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UrgencyBar bulanSisa={n.sisaBulan} />
                      <div>
                        <p className="text-[11px] font-semibold text-gray-700">{n.labelSisa}</p>
                        <div
                          className="h-1.5 rounded-full bg-gray-100 overflow-hidden w-24 mt-1"
                        >
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${n.persenUrgensi}%`, background: n.urgencyBadge.text }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {n.tindakan ? (
                      <Badge variant={n.tindakan === 'musnahkan' ? 'red' : 'green'}>
                        {n.tindakan === 'musnahkan' ? 'Dimusnahkan' : 'Dipertahankan'}
                      </Badge>
                    ) : (
                      <Badge variant="amber">Perlu Tindakan</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {!n.tindakan ? (
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm"
                          style={{
                            color: '#0F6E56',
                            borderColor: '#9FE1CB',
                            background: '#E1F5EE',
                          }}
                          onClick={() => { setSelected(n); setModalType('pertahankan') }}
                        >
                          <ShieldCheck size={12} />
                          Pertahankan
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{
                            color: '#A32D2D',
                            borderColor: '#F7C1C1',
                            background: '#FCEBEB',
                          }}
                          onClick={() => { setSelected(n); setModalType('musnahkan') }}
                        >
                          <Flame size={12} />
                          Musnahkan
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Selesai</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
