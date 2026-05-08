import api from './api'

export const familyService = {
  getByClient: (clientId) => api.get(`/api/family/client/${clientId}`),
  getTree: (clientId)     => api.get(`/api/family/tree/${clientId}`),
  add:    (data)          => api.post('/api/family', data),
  update: (id, data)      => api.put(`/api/family/${id}`, data),
  delete: (id)            => api.delete(`/api/family/${id}`),
}
