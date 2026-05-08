// documentService.js - Service for document operations

import { mockDokumen } from '../data/mockData.js'

/**
 * Save document metadata
 * @param {object} documentData - Document data to save
 * @returns {Promise<object>} - Saved document
 */
export async function saveDocument(documentData) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))

  const newDoc = {
    id: `d${Date.now()}`,
    ...documentData,
    createdAt: new Date().toISOString()
  }

  // In real app, this would save to database
  mockDokumen.push(newDoc)

  return newDoc
}

/**
 * Check if document number already exists
 * @param {string} nomorDokumen - Document number to check
 * @returns {boolean} - True if exists
 */
export function documentExists(nomorDokumen) {
  return mockDokumen.some(doc => doc.nomor === nomorDokumen)
}

/**
 * Get all documents
 * @returns {Array} - List of documents
 */
export function getAllDocuments() {
  return mockDokumen
}