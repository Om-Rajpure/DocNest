import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App'
import theme from './theme'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        toastStyle={{ 
          borderRadius: 12, 
          fontFamily: '"DM Sans", sans-serif', 
          fontSize: '0.875rem',
          boxShadow: '0 4px 16px rgba(15,23,42,0.08)',
          border: '1px solid #E2E8F0',
        }}
      />
    </ThemeProvider>
  </React.StrictMode>
)
