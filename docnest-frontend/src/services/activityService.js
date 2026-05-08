import api from './api'

export const activityService = {
  getAll:    () => api.get('/activity'),
  getRecent: () => api.get('/activity/recent'),
  getForEntity: (type, id) => api.get(`/activity/entity/${type}/${id}`),
}
