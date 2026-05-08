import { useNavigate } from 'react-router-dom'
import { Files, AlertTriangle, Folders, Clock, Upload, FolderPlus } from 'lucide-react'
import { mockDokumen, mockNotifikasiRetensi } from '../data/mockData.js'
import { Badge, sifatVariant } from '../components/ui.jsx'

const stats = [
  {
    icon: Files,
    label: 'Total Dokumen',
    val: 248,
    trend: '+12 bulan ini',
    bg: '#E1F5EE',
    iconColor: '#1D9E75',
    trendColor: '#0F6E56',
  },
  {
    icon: AlertTriangle,
    label: 'Akan Kadaluarsa',
    val: 4,
    trend: 'Dalam 6 bulan',
    bg: '#FCEBEB',
    iconColor: '#E24B4A',
    trendColor: '#A32D2D',
  },
  {
    icon: Folders,
    label: 'Total Kategori',
    val: 18,
    trend: '5 sub-kategori baru',
    bg: '#E6F1FB',
    iconColor: '#378ADD',
    trendColor: '#185FA5',
  },
  {
    icon: Clock,
    label: 'Upload Bulan Ini',
    val: 31,
    trend: '+8% dari bulan lalu',
    bg: '#FAEEDA',
    iconColor: '#EF9F27',
    trendColor: '#854F0B',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const kritis = mockNotifikasiRetensi.filter((n) => !n.tindakan)

  return (
    <div className="p-7">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-3.5 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="card hover:border-gray-200 transition-colors cursor-default">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: s.bg }}
            >
              <s.icon size={18} style={{ color: s.iconColor }} />
            </div>
            <p className="text-2xl font-bold tracking-tight text-gray-900">{s.val}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs font-medium mt-1.5" style={{ color: s.trendColor }}>{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Two Column */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Uploads */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Upload Terbaru</p>
            <button className="btn btn-sm" onClick={() => navigate('/dokumen')}>
              <Files size={13} />
              Lihat Semua
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {mockDokumen.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center gap-3 py-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background:
                      d.sifat === 'Rahasia'
                        ? '#FCEBEB'
                        : d.sifat === 'Terbatas'
                        ? '#FAEEDA'
                        : '#E1F5EE',
                  }}
                >
                  <Files
                    size={15}
                    style={{
                      color:
                        d.sifat === 'Rahasia'
                          ? '#A32D2D'
                          : d.sifat === 'Terbatas'
                          ? '#854F0B'
                          : '#0F6E56',
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-800 truncate">{d.title}</p>
                  <p className="text-[11px] text-gray-400">
                    {d.nomor} · {d.unit}
                  </p>
                </div>
                <Badge variant={sifatVariant(d.sifat)}>{d.sifat}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Retention Alerts */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">🔔 Peringatan Retensi</p>
              <Badge variant="red">{kritis.length} Dokumen</Badge>
            </div>
            <div className="divide-y divide-gray-50">
              {kritis.slice(0, 3).map((n) => (
                <div key={n.id} className="flex gap-2.5 py-2.5">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{
                      background:
                        n.bulanSisa <= 2
                          ? '#E24B4A'
                          : n.bulanSisa <= 4
                          ? '#EF9F27'
                          : '#1D9E75',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-800 truncate">{n.title}</p>
                    <p className="text-[11px] text-gray-500">
                      {n.nomor} · {n.unit}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Kadaluarsa: {n.retensi} · Sisa {n.bulanSisa} bulan
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-sm w-full justify-center mt-2"
              onClick={() => navigate('/notifikasi')}
            >
              <AlertTriangle size={13} />
              Kelola Semua Peringatan
            </button>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <p className="text-sm font-semibold mb-3">Aksi Cepat</p>
            <div className="flex flex-col gap-2">
              <button
                className="btn btn-primary w-full justify-center"
                onClick={() => navigate('/upload')}
              >
                <Upload size={14} />
                Upload &amp; Ekstrak Metadata
              </button>
              <button
                className="btn w-full justify-center"
                onClick={() => navigate('/kategori')}
              >
                <FolderPlus size={14} />
                Kelola Kategori
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
