import api from './api'

export const settingsService = {
  // Form fields
  getFormFields: () => api.get('/api/settings/form-fields'),
  updateFormFields: (fields) => api.put('/api/settings/form-fields', fields),

  // Document types
  getDocTypes: () => api.get('/api/settings/document-types'),
  getActiveDocTypes: () => api.get('/api/settings/document-types/active'),
  addDocType: (dt) => api.post('/api/settings/document-types', dt),
  updateDocType: (id, dt) => api.put(`/api/settings/document-types/${id}`, dt),
  deleteDocType: (id) => api.delete(`/api/settings/document-types/${id}`),

  // Profile
  getProfile: () => api.get('/api/settings/profile'),
  updateProfile: (data) => api.put('/api/settings/profile', data),
  uploadAvatar: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/api/settings/profile/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  // Preferences
  getPreferences: () => api.get('/api/settings/preferences'),
  updatePreferences: (prefs) => api.put('/api/settings/preferences', prefs),
}
