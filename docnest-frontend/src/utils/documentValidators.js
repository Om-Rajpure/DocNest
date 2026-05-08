// ── Document Type Definitions ──────────────────────────────

export const DOCUMENT_TYPES = {
  AADHAR: 'AADHAR',
  PAN: 'PAN',
  DRIVING_LICENSE: 'DRIVING_LICENSE',
  ELECTRICITY_BILL: 'ELECTRICITY_BILL',
}

export const DOCUMENT_CONFIG = {
  [DOCUMENT_TYPES.AADHAR]: {
    label: 'Aadhaar Card',
    icon: '🪪',
    description: 'Government issued 12-digit Aadhaar Card',
  },
  [DOCUMENT_TYPES.PAN]: {
    label: 'PAN Card',
    icon: '💳',
    description: 'Permanent Account Number Card',
  },
  [DOCUMENT_TYPES.DRIVING_LICENSE]: {
    label: 'Driving License',
    icon: '🚗',
    description: 'Valid Driving License issued by RTO',
  },
  [DOCUMENT_TYPES.ELECTRICITY_BILL]: {
    label: 'Electricity Bill',
    icon: '⚡',
    description: 'Recent Electricity / Utility Bill',
  },
}

// ── Aadhaar Validator ──────────────────────────────────────
const AADHAAR_PATTERNS = [
  /\b\d{4}\s\d{4}\s\d{4}\b/,
  /\b\d{12}\b/,
  /\b\d{4}-\d{4}-\d{4}\b/,
]

const AADHAAR_KEYWORDS = [
  'aadhaar', 'aadhar', 'uidai', 'unique identification',
  'government of india', 'भारत सरकार', 'आधार', 'enrolment',
  'dob', 'date of birth', 'male', 'female',
]

export function validateAadhaar(text) {
  const lower = text.toLowerCase().replace(/\s+/g, ' ')
  const hasPattern = AADHAAR_PATTERNS.some(p => p.test(text))
  const hasKeyword = AADHAAR_KEYWORDS.some(k => lower.includes(k))

  if (!hasPattern) return {
    valid: false, confidence: 0,
    reason: 'No valid 12-digit Aadhaar number pattern found in document.',
    suggestions: ['Ensure the Aadhaar number is clearly visible and not obscured.', 'Try uploading a higher resolution image.', 'Make sure the document is not cropped.'],
  }
  if (!hasKeyword) return {
    valid: false, confidence: 30,
    reason: 'Document contains a 12-digit number but no Aadhaar-related keywords were detected.',
    suggestions: ['Ensure you are uploading an actual Aadhaar card.', 'The UIDAI header or "Aadhaar" text must be visible.'],
  }
  return { valid: true, confidence: 95, reason: 'Aadhaar number pattern and document keywords verified successfully.', suggestions: [] }
}

// ── PAN Validator ──────────────────────────────────────────
const PAN_PATTERN = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/

const PAN_KEYWORDS = [
  'permanent account number', 'pan', 'income tax', 'income tax department',
  'govt. of india', 'government of india', 'आयकर विभाग',
]

export function validatePAN(text) {
  const upper = text.toUpperCase()
  const lower = text.toLowerCase()
  const match = upper.match(PAN_PATTERN)
  const hasKeyword = PAN_KEYWORDS.some(k => lower.includes(k.toLowerCase()))

  if (!match) return {
    valid: false, confidence: 0,
    reason: 'No valid PAN number (format: ABCDE1234F) found in the document.',
    suggestions: ['PAN number must be clearly visible on the card.', 'Ensure the image is not blurry or overexposed.', 'PAN format is 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F).'],
  }
  if (!hasKeyword) return {
    valid: false, confidence: 40,
    reason: `Found a PAN-format number (${match[0]}) but no Income Tax Department keywords detected.`,
    suggestions: ['Ensure you are uploading the actual PAN card.', '"Income Tax Department" or "Permanent Account Number" text must be visible.'],
  }
  return { valid: true, confidence: 97, extractedValue: match[0], reason: `PAN number ${match[0]} verified successfully.`, suggestions: [] }
}

// ── Driving License Validator ──────────────────────────────
const DL_PATTERNS = [
  /\b[A-Z]{2}[0-9]{2}\s?[0-9]{4}[0-9]{7}\b/,
  /\b[A-Z]{2}-[0-9]{2}-[0-9]{4}-[0-9]{7}\b/,
  /\b[A-Z]{2}[0-9]{13}\b/,
  /driving\s*licen[sc]e\s*no[.:]*\s*([A-Z0-9-]+)/i,
  /dl\s*no[.:]*\s*([A-Z0-9-]+)/i,
  /licence\s*no[.:]*\s*([A-Z0-9-]+)/i,
]

const DL_KEYWORDS = [
  'driving licence', 'driving license', 'dl no', 'licence no',
  'transport department', 'rto', 'motor vehicles',
  'valid upto', 'valid till', 'valid through', 'date of issue',
  'cov', 'class of vehicle', 'lmv', 'mcwg',
]

export function validateDrivingLicense(text) {
  const lower = text.toLowerCase()
  const upper = text.toUpperCase()
  const hasPattern = DL_PATTERNS.some(p => p.test(upper))
  const keywordsFound = DL_KEYWORDS.filter(k => lower.includes(k))
  const hasKeyword = keywordsFound.length >= 2

  if (!hasPattern && !hasKeyword) return {
    valid: false, confidence: 0,
    reason: 'No Driving License number pattern or relevant keywords found.',
    suggestions: ['Upload the full front side of your Driving License.', 'Ensure DL number, validity date, and RTO details are visible.', 'Try a higher resolution scan.'],
  }
  if (hasKeyword && !hasPattern) return {
    valid: true, confidence: 70,
    reason: 'Driving License keywords detected. Number pattern partially matched.',
    suggestions: ['For best results, ensure the DL number is clearly readable.'],
  }
  if (hasPattern && !hasKeyword) return {
    valid: false, confidence: 35,
    reason: 'A license-format number was found but no Driving License keywords detected.',
    suggestions: ['Ensure "Driving Licence", validity, and RTO text are visible.'],
  }
  return { valid: true, confidence: 93, reason: 'Driving License number and keywords verified successfully.', suggestions: [] }
}

// ── Electricity Bill Validator ─────────────────────────────
const ELEC_REQUIRED = [
  'electricity', 'electric', 'power', 'energy',
  'consumer no', 'consumer number', 'account no', 'account number',
  'mseb', 'msedcl', 'bescom', 'tneb', 'tata power', 'adani electricity',
  'torrent power', 'bses', 'wbsedcl', 'discoms', 'discom',
]

const ELEC_BILLING = [
  'bill', 'invoice', 'units consumed', 'kwh', 'meter reading',
  'due date', 'amount due', 'total amount', 'bill period',
  'billing period', 'bill date', 'bill no', 'bill number',
  'previous reading', 'current reading', 'tariff',
]

const CONSUMER_PATTERN = /(?:consumer\s*(?:no|number|#|id)[.:]*\s*)([A-Z0-9-]{6,15})/i

export function validateElectricityBill(text) {
  const lower = text.toLowerCase()
  const reqMatched = ELEC_REQUIRED.filter(k => lower.includes(k.toLowerCase()))
  const billMatched = ELEC_BILLING.filter(k => lower.includes(k.toLowerCase()))
  const hasConsumer = CONSUMER_PATTERN.test(text)

  if (reqMatched.length < 1) return {
    valid: false, confidence: 0,
    reason: 'No electricity provider or utility keywords detected.',
    suggestions: ['Upload an electricity bill from a recognized provider (MSEDCL, BESCOM, TATA Power, etc.).', 'Ensure the provider name and "Consumer No" are clearly visible.'],
  }
  if (billMatched.length < 2) return {
    valid: false, confidence: 40,
    reason: 'Electricity provider detected but billing information (units, amount, period) is missing.',
    suggestions: ['Upload the complete bill, not just a partial page.', 'Ensure billing period, amount due, and meter readings are visible.'],
  }
  return {
    valid: true,
    confidence: hasConsumer ? 96 : 82,
    reason: `Electricity bill verified. Provider keywords (${reqMatched.slice(0, 2).join(', ')}) and billing details confirmed.`,
    suggestions: hasConsumer ? [] : ['Consumer number was not clearly extracted but bill appears valid.'],
  }
}

// ── Master Router ──────────────────────────────────────────
export function validateDocument(docType, text) {
  switch (docType) {
    case DOCUMENT_TYPES.AADHAR:           return validateAadhaar(text)
    case DOCUMENT_TYPES.PAN:              return validatePAN(text)
    case DOCUMENT_TYPES.DRIVING_LICENSE:  return validateDrivingLicense(text)
    case DOCUMENT_TYPES.ELECTRICITY_BILL: return validateElectricityBill(text)
    default: return { valid: true, confidence: 50, reason: 'Document type not validated via OCR.', suggestions: [] }
  }
}
