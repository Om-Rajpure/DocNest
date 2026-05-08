import api from './api'

export const settingsService = {
  // Form fields
  getFormFields: () => api.get('/settings/form-fields'),
  updateFormFields: (fields) => api.put('/settings/form-fields', fields),

  // Document types
  getDocTypes: () => api.get('/settings/document-types'),
  getActiveDocTypes: () => api.get('/settings/document-types/active'),
  addDocType: (dt) => api.post('/settings/document-types', dt),
  updateDocType: (id, dt) => api.put(`/settings/document-types/${id}`, dt),
  deleteDocType: (id) => api.delete(`/settings/document-types/${id}`),

  // Profile
  getProfile: () => api.get('/settings/profile'),
  updateProfile: (data) => api.put('/settings/profile', data),
  uploadAvatar: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/settings/profile/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  // Preferences
  getPreferences: () => api.get('/settings/preferences'),
  updatePreferences: (prefs) => api.put('/settings/preferences', prefs),
}
