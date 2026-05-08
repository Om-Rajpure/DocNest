import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { MdRefresh } from 'react-icons/md'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', background: 'var(--surface-2)', p: 4, textAlign: 'center',
        }}>
          <Box sx={{ 
            width: 80, height: 80, 
            border: '2px dashed var(--border-strong)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mb: 3, background: 'var(--surface-3)',
          }}>
            <Box sx={{ fontSize: 36 }}>💥</Box>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: 'var(--font-heading)', mb: 1 }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 4, maxWidth: 400 }}>
            An unexpected error occurred. Please try refreshing the page. If the problem persists, contact support.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<MdRefresh />} 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}
