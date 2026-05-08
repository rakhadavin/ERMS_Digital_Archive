import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AutoMetadata from './pages/AutoMetadata.jsx'
import Notifikasi from './pages/Notifikasi.jsx'
import DaftarKategori from "./pages/DaftarKategori.jsx";
import DaftarDokumen from "./pages/DaftarDokumen.jsx";

// Placeholder — akan diganti satu per satu sesuai urutan pengerjaan
function ComingSoon({ nama }) {
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', gap: 12,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: '#F5F4F0', color: '#6B6A65'
    }}>
      <div style={{ 
        width: 48, height: 48, borderRadius: 12, background: '#E1F5EE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24
      }}>🗃️</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A18' }}>
        Sistem Arsip Digital
      </div>
      <div style={{ fontSize: 13 }}>
        Halaman <strong>{nama}</strong> sedang disiapkan...
      </div>
      <div style={{ 
        marginTop: 8, fontSize: 11, background: '#fff', 
        padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.08)',
        fontFamily: 'DM Mono, monospace'
      }}>
        npm run dev → http://localhost:5173
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<AutoMetadata />} />
          <Route path="/notifikasi" element={<Notifikasi />} />
          <Route path="/dokumen" element={<DaftarDokumen />} />
          <Route path="/dokumen/:id" element={<ComingSoon nama="Detail Dokumen" />} />
          <Route path="/kategori" element={<DaftarKategori />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
