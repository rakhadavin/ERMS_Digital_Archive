import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Files, AlertTriangle, Folders, Clock, Upload, FolderPlus, Search, Loader2 } from 'lucide-react'
import { mockDokumen, mockNotifikasiRetensi } from '../data/mockData.js'
import { Badge, sifatVariant } from '../components/ui.jsx'
import { getSuggestions, simulateLLM } from '../utils/aiSuggestion.js'

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

// ─── Badge styles per suggestion type ────────────────────────────────────────

function SuggestionBadge({ type }) {
  if (type === 'MC')
    return (
      <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-green-100 text-green-700">
        Kategori Utama
      </span>
    )
  if (type === 'SC')
    return (
      <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700">
        Sub-Kategori
      </span>
    )
  return (
    <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
      ✨ AI
    </span>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const kritis = mockNotifikasiRetensi.filter((n) => !n.tindakan)

  const [query, setQuery] = useState('')
  const [level1, setLevel1] = useState([])
  const [aiResults, setAiResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const debounceRef = useRef(null)
  const llmDebounceRef = useRef(null)
  const abortAI = useRef(false)

  // ── Click outside to close ──────────────────────────────────────────────────
  useEffect(() => {
    function onMouseDown(e) {
      if (
        dropdownRef.current?.contains(e.target) ||
        inputRef.current?.contains(e.target)
      ) return
      setShowDropdown(false)
      setActiveIndex(-1)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  // ── Input change → debounced suggestion fetch ───────────────────────────────
  function handleQueryChange(e) {
    const val = e.target.value
    setQuery(val)
    setActiveIndex(-1)
    clearTimeout(debounceRef.current)
    clearTimeout(llmDebounceRef.current)
    abortAI.current = true

    if (val.trim().length < 2) {
      setLevel1([])
      setAiResults([])
      setShowDropdown(false)
      setIsLoadingAI(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      const { level1: l1, triggerLLM } = getSuggestions(val)
      setLevel1(l1)
      setAiResults([])
      setShowDropdown(true)

      if (triggerLLM) {
        setIsLoadingAI(true)
        abortAI.current = false
        llmDebounceRef.current = setTimeout(() => {
          simulateLLM(val).then((results) => {
            if (!abortAI.current) {
              setAiResults(results)
              setIsLoadingAI(false)
            }
          })
        }, 500)
      } else {
        setIsLoadingAI(false)
      }
    }, 300)
  }

  // ── Keyboard navigation ─────────────────────────────────────────────────────
  const allItems = [...level1, ...aiResults]

  function handleKeyDown(e) {
    if (!showDropdown || allItems.length === 0) {
      if (e.key === 'Enter') execSearch()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((p) => Math.min(p + 1, allItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((p) => Math.max(p - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0) pickSuggestion(allItems[activeIndex])
      else execSearch()
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setActiveIndex(-1)
    }
  }

  function pickSuggestion(item) {
    setQuery(item.name)
    setLevel1([])
    setAiResults([])
    setShowDropdown(false)
    setActiveIndex(-1)
    abortAI.current = true
    setIsLoadingAI(false)
    navigate(`/dokumen?q=${encodeURIComponent(item.name)}`)
  }

  function execSearch(e) {
    e?.preventDefault()
    const q = query.trim()
    setShowDropdown(false)
    abortAI.current = true
    navigate(q ? `/dokumen?q=${encodeURIComponent(q)}` : '/dokumen')
  }

  const noResults = showDropdown && !isLoadingAI && level1.length === 0 && aiResults.length === 0

  return (
    <div className="p-7">
      {/* ── Search bar with suggestion dropdown ── */}
      <form onSubmit={execSearch} className="mb-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
            placeholder="Cari dokumen berdasarkan kategori utama…"
            className="w-full pl-10 pr-28 py-2.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 placeholder-gray-400 text-gray-800"
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary btn-sm"
          >
            Cari Dokumen
          </button>

          {/* ── Dropdown ── */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
            >
              {/* Level 1 results */}
              {level1.map((item, i) => (
                <button
                  key={item.code}
                  type="button"
                  onMouseDown={() => pickSuggestion(item)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors ${
                    activeIndex === i ? 'bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <SuggestionBadge type={item.type} />
                  <span className="flex-1 text-sm text-gray-800 truncate">{item.name}</span>
                  <span className="shrink-0 text-[11px] font-mono text-gray-400">{item.code}</span>
                </button>
              ))}

              {/* Divider + AI section */}
              {(aiResults.length > 0 || isLoadingAI) && (
                <>
                  {level1.length > 0 && <div className="border-t border-gray-100 mx-3" />}
                  <div className="flex items-center gap-2 px-3.5 py-1.5">
                    <span className="text-[10px] font-semibold text-purple-500 uppercase tracking-wider">
                      Saran AI
                    </span>
                    {isLoadingAI && (
                      <Loader2 size={11} className="text-purple-400 animate-spin" />
                    )}
                  </div>
                  {aiResults.map((item, i) => {
                    const idx = level1.length + i
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onMouseDown={() => pickSuggestion(item)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors ${
                          activeIndex === idx ? 'bg-purple-50' : 'hover:bg-purple-50'
                        }`}
                      >
                        <SuggestionBadge type="AI" />
                        <span className="flex-1 text-sm text-gray-800 truncate">{item.name}</span>
                        <span className="shrink-0 text-[11px] font-mono text-gray-400">{item.code}</span>
                      </button>
                    )
                  })}
                </>
              )}

              {/* Loading only (no results yet) */}
              {isLoadingAI && level1.length === 0 && aiResults.length === 0 && (
                <div className="flex items-center gap-2 px-3.5 py-3 text-sm text-gray-400">
                  <Loader2 size={13} className="animate-spin text-purple-400" />
                  Mencari saran AI…
                </div>
              )}

              {/* No results fallback */}
              {noResults && (
                <div className="px-3.5 py-3 text-sm text-gray-400">
                  Tidak ada saran.{' '}
                  <span className="text-gray-500 font-medium">Coba kata lain atau gunakan chatbot.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </form>

      {/* ── Stat Cards ── */}
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

      {/* ── Two Column ── */}
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
