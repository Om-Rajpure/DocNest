import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor — attach JWT token + log
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('docnest_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — detailed error messages + auth handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      // Handle Authentication Failures
      if (status === 401 || status === 403) {
        console.warn('[API] Auth failed, clearing session');
        localStorage.removeItem('docnest_token');
        // Optional: redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }

      console.error(`[API Error] ${status}:`, data)

      let message = data?.error || data?.message || ''
      if (status === 400) message = message || 'Invalid data. Please check all fields.'
      else if (status === 404) message = 'Resource not found.'
      else if (status === 500) message = message || 'Server error. Check backend logs.'
      else message = message || `Request failed (${status})`

      return Promise.reject(new Error(message))
    } else if (error.request) {
      console.error('[API Error] No response — is the backend running?')
      return Promise.reject(new Error('Cannot reach server. Make sure the backend is running.'))
    }
    return Promise.reject(new Error(error.message || 'Something went wrong'))
  }
)

export default api
