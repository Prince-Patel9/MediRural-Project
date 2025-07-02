import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';

const SnackbarContext = createContext();

export function useSnackbar() {
  return useContext(SnackbarContext);
}

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', action: null });

  const showSnackbar = useCallback(({ message, severity = 'success', action = null }) => {
    setSnackbar({ open: true, message, severity, action });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={handleClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  sx={{
    mt: { xs: 8, sm: 9 }, // adjusted for better positioning
    zIndex: 1400,
    '& .MuiSnackbarContent-root': {
      minWidth: 'auto',
    }
  }}
>
  <Alert
    onClose={handleClose}
    severity={snackbar.severity}
    variant="filled"
    sx={{
      minWidth: '320px',
      maxWidth: '500px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 16px rgba(0, 0, 0, 0.08)',
      fontWeight: 500,
      fontSize: '0.95rem',
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      alignItems: 'center',
      py: 2,
      px: 3,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      
      // Success styling (matches your blue theme)
      ...(snackbar.severity === 'success' && {
        background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
        color: '#ffffff',
        '& .MuiAlert-icon': {
          color: '#ffffff',
          fontSize: '1.3rem',
        },
        '& .MuiIconButton-root': {
          color: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }
      }),
      
      // Error styling
      ...(snackbar.severity === 'error' && {
        background: 'linear-gradient(135deg, #ea4335 0%, #d73502 100%)',
        color: '#ffffff',
        '& .MuiAlert-icon': {
          color: '#ffffff',
          fontSize: '1.3rem',
        },
        '& .MuiIconButton-root': {
          color: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }
      }),
      
      // Warning styling
      ...(snackbar.severity === 'warning' && {
        background: 'linear-gradient(135deg, #fbbc04 0%, #f9ab00 100%)',
        color: '#1a1a1a',
        '& .MuiAlert-icon': {
          color: '#1a1a1a',
          fontSize: '1.3rem',
        },
        '& .MuiIconButton-root': {
          color: 'rgba(26, 26, 26, 0.7)',
          '&:hover': {
            backgroundColor: 'rgba(26, 26, 26, 0.1)',
          }
        }
      }),
      
      // Info styling
      ...(snackbar.severity === 'info' && {
        background: 'linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)',
        color: '#ffffff',
        '& .MuiAlert-icon': {
          color: '#ffffff',
          fontSize: '1.3rem',
        },
        '& .MuiIconButton-root': {
          color: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }
      }),
      
      // Hover and animation effects
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'translateY(0)',
      animation: 'slideInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 20px rgba(0, 0, 0, 0.1)',
      },
      
      // Icon styling
      '& .MuiAlert-icon': {
        marginRight: '12px',
        marginLeft: '4px',
      },
      
      // Message text styling
      '& .MuiAlert-message': {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      },
      
      // Close button styling
      '& .MuiAlert-action': {
        marginLeft: '16px',
        marginRight: '-4px',
        '& .MuiIconButton-root': {
          padding: '6px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
        }
      },
      
      // Add keyframe animation
      '@keyframes slideInDown': {
        '0%': {
          transform: 'translateY(-100px)',
          opacity: 0,
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: 1,
        }
      }
    }}
    
    elevation={0}
    action={snackbar.action}
  >
    {snackbar.message}
  </Alert>
</Snackbar>
    </SnackbarContext.Provider>
  );
} 