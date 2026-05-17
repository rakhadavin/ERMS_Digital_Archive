import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Sparkles,
  Bell,
  Files,
  Folder,
  Archive,
  Settings,
} from 'lucide-react'
import { mockNotifikasiRetensi } from '../data/mockData.js'
import Chatbot from './Chatbot.jsx'

const navItems = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload',     icon: Sparkles,        label: 'Auto-Metadata' },
  { to: '/notifikasi', icon: Bell,            label: 'Notifikasi Retensi', badge: true },
  { to: '/dokumen',    icon: Files,           label: 'Daftar Dokumen' },
  { to: '/kategori',   icon: Folder,          label: 'Kosakata Kategori' },
]

const pageMeta = {
  "/": { title: "Dashboard", sub: "Selamat datang di MetaLexicon" },
  "/upload": { title: "Auto-Metadata", sub: "Upload dokumen dan ekstraksi metadata otomatis" },
  "/notifikasi": { title: "Notifikasi Retensi", sub: "Dokumen yang mendekati batas masa retensi" },
  "/dokumen": { title: "Daftar Dokumen", sub: "Semua dokumen tersimpan dalam arsip" },
  "/kategori": { title: "Kosakata Kategori", sub: "Kelola kategori utama dan sub-kategori" },
};

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] ?? { title: 'Arsip Digital', sub: '' }
  const notifCount = mockNotifikasiRetensi.filter((n) => !n.tindakan).length

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F4F0]">
      {/* Sidebar */}
      <aside className="w-[220px] min-w-[220px] bg-white border-r border-gray-100 flex flex-col">
        {/* Brand */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center mb-2">
            <Archive size={16} className="text-white" />
          </div>
          <p className="text-sm font-bold leading-tight tracking-tight text-gray-900">MetaLexicon</p>
          <p className="text-[10px] text-gray-400 mt-0.5 font-mono tracking-wide">v0.1 · Metadata Solution</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-4 mb-1.5">Menu</p>
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-all relative border-none
                ${isActive ? "bg-brand-50 text-brand-600 font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-brand-400 rounded-r-full" />}
                  <Icon size={16} />
                  {label}
                  {badge && notifCount > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{notifCount}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-[11px] text-gray-400">Kompetisi Metadata Arsip</p>
          <p className="text-[10px] text-gray-300 mt-0.5">Standar · Interoperabilitas · Preservasi</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-7 shrink-0 sticky top-0 z-10">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900">{meta.title}</h2>
            <p className="text-xs text-gray-400">{meta.sub}</p>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/notifikasi" className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 relative">
              <Bell size={15} />
              {notifCount > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </NavLink>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <Settings size={15} />
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-600">A</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <Chatbot />
    </div>
  );
}
