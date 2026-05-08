import api from './api'

export const locationService = {
  getAll: () => api.get('/api/locations'),
  create: (data) => api.post('/api/locations', data),
  update: (id, data) => api.put(`/api/locations/${id}`, data),
  delete: (id) => api.delete(`/api/locations/${id}`),
}
