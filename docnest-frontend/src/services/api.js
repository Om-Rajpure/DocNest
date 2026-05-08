import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 60000, // 60s to handle Render cold starts
});

// Request interceptor — attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('docnest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 || status === 403) {
        console.warn('[API] Auth failed, clearing session');
        localStorage.removeItem('docnest_token');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }

      const message = data?.message || data?.error || `Request failed (${status})`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Handle Render cold starts and network errors
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Server waking up, please wait...'));
      }
      return Promise.reject(new Error('Connection lost. Please check your internet.'));
    }
    return Promise.reject(new Error(error.message || 'Something went wrong'));
  }
);

export default API;
