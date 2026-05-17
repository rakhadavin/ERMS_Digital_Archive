// classification.js - Logic for classifying documents based on extracted code

import { mockSubKategori } from '../data/mockData.js'

/**
 * Find sub-category by code_SC
 * @param {string} codeSC - The classification code (e.g., "KU.01")
 * @returns {object|null} - Sub-category object or null if not found
 */
export function findSubCategory(codeSC) {
  return mockSubKategori.find(sc => sc.code_SC === codeSC) || null
}

/**
 * Classify document based on nomor_dokumen
 * @param {string} nomorDokumen - Document number
 * @returns {object} - Classification result
 */
export function classifyDocument(nomorDokumen) {
  // Parse the classification code from nomor_dokumen
  const parts = nomorDokumen.split('/')
  if (parts.length < 2) {
    return {
      success: false,
      error: 'Invalid document number format',
      data: null
    }
  }

  const codeSC = parts[1] // e.g., "KU.01"

  const subCategory = findSubCategory(codeSC)
  if (!subCategory) {
    return {
      success: false,
      error: `Classification code "${codeSC}" not found in standard vocabulary`,
      data: null
    }
  }

  return {
    success: true,
    error: null,
    data: {
      code_SC: subCategory.code_SC,
      name_SC: subCategory.name_SC,
      code_MC: subCategory.code_MC,
      masa_retensi_aktif: subCategory.masa_retensi_aktif,
      masa_retensi_inaktif: subCategory.masa_retensi_inaktif,
      keterangan: subCategory.keterangan,
    }
  }
}