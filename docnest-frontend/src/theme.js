import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
      dark: '#4338CA',
      light: '#818CF8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0EA5E9',
      contrastText: '#ffffff',
    },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "DM Sans", -apple-system, sans-serif',
    h1: { fontFamily: '"DM Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"DM Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: '"DM Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontFamily: '"DM Sans", sans-serif', fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontFamily: '"DM Sans", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"DM Sans", sans-serif', fontWeight: 600 },
    subtitle1: { fontWeight: 600, color: '#0F172A' },
    subtitle2: { fontWeight: 600, color: '#475569' },
    body1: { lineHeight: 1.6, color: '#334155' },
    body2: { lineHeight: 1.5, color: '#475569' },
    caption: { color: '#94A3B8', lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: 'none', fontFamily: '"DM Sans", sans-serif' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 4px 16px rgba(15,23,42,0.08)',
    '0 10px 40px rgba(15,23,42,0.12)',
    '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)',
    ...Array(20).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          minHeight: 44,
          fontWeight: 600,
          transition: 'all 0.15s ease',
        },
        containedPrimary: {
          boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
          '&:hover': {
            background: '#4338CA',
            boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.25)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#CBD5E1',
          color: '#475569',
          '&:hover': {
            background: '#F8FAFC',
            borderColor: '#94A3B8',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            minHeight: 44,
            background: '#fff',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            '& fieldset': { borderColor: '#E2E8F0' },
            '&:hover fieldset': { borderColor: '#CBD5E1' },
            '&.Mui-focused fieldset': { borderColor: '#4F46E5', borderWidth: 2 },
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 500,
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.75rem',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.9rem',
          minHeight: 48,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#4F46E5',
          height: 2,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 10px 40px rgba(15,23,42,0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
