import api from './api';

export const authService = {
  login:    (data)  => api.post('/api/auth/login', data).then(r => r.data),
  register: (data)  => api.post('/api/auth/register', data).then(r => r.data),
  getMe:    (token) => api.get('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.data),
};
