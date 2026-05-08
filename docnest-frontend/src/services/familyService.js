import api from './api'

export const familyService = {
  getByClient: (clientId) => api.get(`/family/client/${clientId}`),
  getTree: (clientId)     => api.get(`/family/tree/${clientId}`),
  add:    (data)          => api.post('/family', data),
  update: (id, data)      => api.put(`/family/${id}`, data),
  delete: (id)            => api.delete(`/family/${id}`),
}
