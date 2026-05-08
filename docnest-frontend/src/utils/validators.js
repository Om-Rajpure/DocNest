// Mobile number: 10 digits
export const isValidMobile = (mobile) => /^\d{10}$/.test(mobile)

// PAN: 5 letters + 4 digits + 1 letter (ABCDE1234F)
export const isValidPAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan?.toUpperCase())

// Email
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Required field
export const isRequired = (val) => val !== undefined && val !== null && String(val).trim() !== ''

// Allowed file types for document upload
export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png']
export const MAX_FILE_SIZE_MB = 20

export const isAllowedFileType = (file) => ALLOWED_FILE_TYPES.includes(file.type)

export const isFileSizeOk = (file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024
