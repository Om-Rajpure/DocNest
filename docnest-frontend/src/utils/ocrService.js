import Tesseract from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist'

// Set pdfjs worker from CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

/**
 * Main entry — accepts a File, returns extracted text.
 * @param {File} file  Image or PDF
 * @param {function} onProgress  progress 0-100
 * @returns {Promise<string>}
 */
export async function extractTextFromFile(file, onProgress = () => {}) {
  if (file.type === 'application/pdf') {
    return await extractTextFromPDF(file, onProgress)
  }
  return await extractTextFromImage(file, onProgress)
}

/**
 * Run Tesseract on image file/blob
 */
async function extractTextFromImage(file, onProgress) {
  const url = URL.createObjectURL(file)
  try {
    const result = await Tesseract.recognize(url, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') onProgress(Math.round(m.progress * 100))
      },
    })
    return result.data.text
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Render each PDF page to canvas → OCR each page → combine text
 */
async function extractTextFromPDF(file, onProgress) {
  const buf = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise
  const totalPages = pdf.numPages
  let fullText = ''

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i)
    const scale = 2.0
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')
    await page.render({ canvasContext: ctx, viewport }).promise

    const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'))
    const pageText = await extractTextFromImage(blob, (p) => {
      const overall = Math.round(((i - 1) / totalPages) * 100 + p / totalPages)
      onProgress(Math.min(overall, 99))
    })
    fullText += '\n' + pageText
  }

  onProgress(100)
  return fullText
}
