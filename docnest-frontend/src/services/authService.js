import api from './api';

export const authService = {
  login:    (data)  => api.post('/auth/login', data).then(r => r.data),
  register: (data)  => api.post('/auth/register', data).then(r => r.data),
  getMe:    (token) => api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.data),
};
