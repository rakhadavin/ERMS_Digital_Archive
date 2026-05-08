/**
 * useRetention.js
 * Custom hook untuk manajemen state notifikasi retensi
 */
import { useState, useMemo, useCallback } from 'react'
import { mockNotifikasiRetensi } from '@/data'
import {
  getUrgensiRetensi,
  hitungSisaBulan,
  hitungPersenUrgensi,
  formatSisaRetensi,
} from '@/utils'

/**
 * Hook utama untuk halaman Notifikasi Retensi.
 *
 * @returns {{
 *   items: Array,
 *   filter: string,
 *   setFilter: Function,
 *   handleTindakan: Function,
 *   stats: object,
 * }}
 */
export function useRetention() {
  const [items, setItems] = useState(() =>
    mockNotifikasiRetensi.map((n) => ({ ...n }))
  )
  const [filter, setFilter] = useState('semua')

  // Enriched items: tambahkan computed fields
  const enrichedItems = useMemo(() => {
    const sekarang = new Date()
    return items.map((item) => ({
      ...item,
      sisa_bulan: hitungSisaBulan(item.tahun_retensi, sekarang),
      urgensi: getUrgensiRetensi(item.tahun_retensi, sekarang),
      label_sisa: formatSisaRetensi(item.tahun_retensi, sekarang),
      persen_urgensi: hitungPersenUrgensi(
        hitungSisaBulan(item.tahun_retensi, sekarang)
      ),
    }))
  }, [items])

  // Filter items
  const filteredItems = useMemo(() => {
    if (filter === 'semua') return enrichedItems
    if (filter === 'belum') return enrichedItems.filter((n) => !n.tindakan)
    if (filter === 'pertahankan') return enrichedItems.filter((n) => n.tindakan === 'pertahankan')
    if (filter === 'musnahkan') return enrichedItems.filter((n) => n.tindakan === 'musnahkan')
    return enrichedItems
  }, [enrichedItems, filter])

  // Statistik ringkasan
  const stats = useMemo(() => ({
    total: items.length,
    belumDitangani: enrichedItems.filter((n) => !n.tindakan).length,
    dipertahankan: enrichedItems.filter((n) => n.tindakan === 'pertahankan').length,
    dimusnahkan: enrichedItems.filter((n) => n.tindakan === 'musnahkan').length,
    kritis: enrichedItems.filter((n) => n.urgensi === 'kritis' || n.urgensi === 'kadaluarsa').length,
  }), [enrichedItems, items])

  // Aksi tindakan (Pertahankan / Musnahkan)
  const handleTindakan = useCallback((id, tindakan) => {
    setItems((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, tindakan, tindakan_oleh: 'Admin', tindakan_at: new Date().toISOString() }
          : n
      )
    )
  }, [])

  return { items: filteredItems, filter, setFilter, handleTindakan, stats, allItems: enrichedItems }
}
