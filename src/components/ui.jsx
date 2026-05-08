// ─── Badge ────────────────────────────────────────────────────────────────────

export function Badge({ children, variant = 'gray' }) {
  const variants = {
    green: 'badge-green',
    amber: 'badge-amber',
    red: 'badge-red',
    blue: 'badge-blue',
    gray: 'badge-gray',
  }
  return <span className={`badge ${variants[variant] ?? variants.gray}`}>{children}</span>
}

export function sifatVariant(sifat) {
  if (sifat === 'Rahasia') return 'red'
  if (sifat === 'Terbatas') return 'amber'
  if (sifat === 'Terbuka') return 'blue'
  return 'green'
}

// ─── Confidence Bar ───────────────────────────────────────────────────────────

export function ConfidenceBar({ score }) {
  const color =
    score >= 85 ? '#1D9E75' : score >= 70 ? '#EF9F27' : '#E24B4A'
  return (
    <span className="flex items-center gap-1.5 ml-auto">
      <span
        className="block h-1 w-12 rounded-full bg-gray-100 overflow-hidden"
      >
        <span
          className="block h-full rounded-full"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </span>
      <span className="text-[10px] font-semibold" style={{ color }}>{score}%</span>
    </span>
  )
}

// ─── Form Field ───────────────────────────────────────────────────────────────

export function FormField({ label, children, conf, full = false }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1.5">
        {label}
        {conf !== undefined && <ConfidenceBar score={conf} />}
      </label>
      {children}
    </div>
  )
}

// ─── Page Header ─────────────────────────────────────────────────────────────

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-base font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, desc }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      {desc && <div className="text-xs text-gray-400 mt-1">{desc}</div>}
    </div>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────

export function Modal({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-gray-100 w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

export function Spinner({ size = 10 }) {
  return (
    <div
      className={`w-${size} h-${size} border-2 border-gray-100 border-t-brand-400 rounded-full animate-spin`}
    />
  )
}
