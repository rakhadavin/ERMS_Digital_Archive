// metadataExtractor.js - Extract metadata fields from OCR text

/**
 * Extract metadata from OCR text
 * @param {string} text - OCR extracted text
 * @returns {object} - Extracted metadata with confidence scores
 */
export function extractMetadata(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line)

  let metadata = {
    title: '',
    nomor_dokumen: '',
    tanggal_dokumen: '',
    unit_pengolah: '',
    sifat_dokumen: '',
    tentang: '',
    description: '',
    konteks: '',
    confidence: {}
  }

  // Extract title (usually first line or line with "SURAT", "BERITA", etc.)
  const titleLine = lines.find(line =>
    line.toUpperCase().includes('SURAT') ||
    line.toUpperCase().includes('BERITA') ||
    line.toUpperCase().includes('LAPORAN') ||
    line.toUpperCase().includes('KONTRAK')
  )
  if (titleLine) {
    metadata.title = titleLine
    metadata.confidence.title = 90
  }

  // Extract nomor dokumen
  const nomorLine = lines.find(line =>
    line.toUpperCase().includes('NOMOR') ||
    /^\d+\/[A-Z]+\.\d+\/\w+\/\d{4}$/.test(line.replace(/\s/g, ''))
  )
  if (nomorLine) {
    const nomorMatch = nomorLine.match(/(\d+\/[A-Z]+\.\d+\/\w+\/\d{4})/)
    if (nomorMatch) {
      metadata.nomor_dokumen = nomorMatch[1]
      metadata.confidence.nomor = 95
    }
  }

  // Extract tanggal
  const tanggalLine = lines.find(line =>
    line.toUpperCase().includes('TANGGAL') ||
    /\d{1,2}\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember|\w+)\s+\d{4}/i.test(line)
  )
  if (tanggalLine) {
    // Convert to YYYY-MM-DD format
    const dateMatch = tanggalLine.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/i)
    if (dateMatch) {
      const [, day, month, year] = dateMatch
      const monthMap = {
        'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
        'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
        'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
      }
      const monthNum = monthMap[month.toLowerCase()]
      if (monthNum) {
        metadata.tanggal_dokumen = `${year}-${monthNum.padStart(2, '0')}-${day.padStart(2, '0')}`
        metadata.confidence.tanggal = 90
      }
    }
  }

  // Extract unit pengolah
  const unitLine = lines.find(line =>
    line.toUpperCase().includes('UNIT') ||
    line.toUpperCase().includes('DIVISI')
  )
  if (unitLine) {
    const unitMatch = unitLine.match(/(?:UNIT|DIVISI)[:\s]+(.+)/i)
    if (unitMatch) {
      metadata.unit_pengolah = unitMatch[1].trim()
      metadata.confidence.unit = 85
    }
  }

  // Extract sifat dokumen
  const sifatLine = lines.find(line =>
    line.toUpperCase().includes('SIFAT')
  )
  if (sifatLine) {
    const sifatMatch = sifatLine.match(/SIFAT[:\s]+(.+)/i)
    if (sifatMatch) {
      metadata.sifat_dokumen = sifatMatch[1].trim()
      metadata.confidence.sifat = 80
    }
  }

  // Extract perihal/tentang
  const tentangLine = lines.find(line =>
    line.toUpperCase().includes('PERIHAL') ||
    line.toUpperCase().includes('TENTANG')
  )
  if (tentangLine) {
    const tentangMatch = tentangLine.match(/(?:PERIHAL|TENTANG)[:\s]+(.+)/i)
    if (tentangMatch) {
      metadata.tentang = tentangMatch[1].trim()
      metadata.confidence.tentang = 85
    }
  }

  // Extract description
  const descLine = lines.find(line =>
    line.toUpperCase().includes('DESKRIPSI')
  )
  if (descLine) {
    const descMatch = descLine.match(/DESKRIPSI[:\s]+(.+)/i)
    if (descMatch) {
      metadata.description = descMatch[1].trim()
      metadata.confidence.description = 75
    }
  }

  // Extract konteks
  const konteksLine = lines.find(line =>
    line.toUpperCase().includes('KONTEKS')
  )
  if (konteksLine) {
    const konteksMatch = konteksLine.match(/KONTEKS[:\s]+(.+)/i)
    if (konteksMatch) {
      metadata.konteks = konteksMatch[1].trim()
      metadata.confidence.konteks = 70
    }
  }

  return metadata
}