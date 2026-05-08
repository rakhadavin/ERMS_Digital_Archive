// retention.js - Logic for retention calculations

/**
 * Calculate retention year from document date and retention period
 * @param {string} tanggalDokumen - Document date in YYYY-MM-DD format
 * @param {number} retention - Retention period in years
 * @returns {number} - Retention year
 */
export function calculateRetentionYear(tanggalDokumen, retention) {
  const year = new Date(tanggalDokumen).getFullYear()
  return year + retention
}

/**
 * Check if document is expiring soon (within 6 months)
 * @param {number} retentionYear - The retention year
 * @returns {boolean} - True if expiring within 6 months
 */
export function isExpiringSoon(retentionYear) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const monthsUntilExpiry = (retentionYear - currentYear) * 12 - currentMonth

  return monthsUntilExpiry <= 6 && monthsUntilExpiry >= 0
}

/**
 * Get months remaining until expiry
 * @param {number} retentionYear - The retention year
 * @returns {number} - Months remaining (negative if expired)
 */
export function getMonthsRemaining(retentionYear) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  return (retentionYear - currentYear) * 12 - currentMonth
}