import api from './api'

export const documentService = {
  /** Get documents by owner type (CLIENT or FAMILY_MEMBER) */
  getByOwner: (ownerType, ownerId) => api.get(`/documents/owner/${ownerType}/${ownerId}`),

  /** Backward-compat: get by client ID */
  getByClient: (clientId) => api.get(`/documents/client/${clientId}`),

  /** Upload document for any owner — now includes optional OCR data */
  upload: (ownerType, ownerId, documentType, file, ocrText, confidence) => {
    const form = new FormData()
    form.append('ownerType', ownerType)
    form.append('ownerId', ownerId)
    if (documentType) form.append('documentType', documentType)
    form.append('file', file)
    if (ocrText) form.append('ocrText', ocrText)
    if (confidence != null) form.append('confidence', confidence)
    return api.post('/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  replace: (documentId, file) => {
    const form = new FormData()
    form.append('file', file)
    return api.put(`/documents/replace/${documentId}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  delete: (documentId) => api.delete(`/documents/${documentId}`),

  /** Get document completion stats */
  getCompletion: (ownerType, ownerId) => api.get(`/documents/completion/${ownerType}/${ownerId}`),

  getPreviewUrl: (documentId) => `/api/documents/preview/${documentId}`,
}
