import api from './api'

export const activityService = {
  getAll:    () => api.get('/api/activity'),
  getRecent: () => api.get('/api/activity/recent'),
  getForEntity: (type, id) => api.get(`/api/activity/entity/${type}/${id}`),
}
