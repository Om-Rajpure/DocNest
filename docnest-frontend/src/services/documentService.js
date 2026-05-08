import api from './api'

export const documentService = {
  getByClient: (clientId) => api.get(`/documents/client/${clientId}`),

  upload: (clientId, documentType, file) => {
    const form = new FormData()
    form.append('clientId', clientId)
    if (documentType) form.append('documentType', documentType)
    form.append('file', file)
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

  getPreviewUrl: (documentId) => `/api/documents/preview/${documentId}`,
}
