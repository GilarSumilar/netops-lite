/**
 * Format angka ke format Rupiah
 * @param {number} amount
 * @returns {string} e.g. "Rp 150.000"
 */
export function formatRupiah(amount) {
  return 'Rp ' + Number(amount).toLocaleString('id-ID')
}

/**
 * Copy teks ke clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * Format tanggal ke locale Indonesia
 * @param {string|Date} date
 * @returns {string} e.g. "15 Oktober 2026"
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

/**
 * Truncate string
 */
export function truncate(str, len = 50) {
  return str.length > len ? str.slice(0, len) + '…' : str
}
