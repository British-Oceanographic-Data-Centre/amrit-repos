'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { ReactNode, useMemo } from 'react';

export default function ThemeRegistry({
  children,
  mode,
}: {
  children: ReactNode;
  mode: 'light' | 'dark';
}) {
  const theme = useMemo(() => {
    return createTheme({
      typography: {
        fontFamily: 'Lexend, sans-serif',
      },
      palette: {
        mode,
        primary: {
          main: '#4DB1B5',
          contrastText: mode === 'dark' ? '#000000' : '#ffffff',
        },
        secondary: {
          main: mode === 'dark' ? '#FFB74D' : '#F57C00',
        },
        background: {
          default: mode === 'dark' ? '#121212' : '#fdfdfd',
          paper: mode === 'dark' ? '#1E1E1E' : '#ffffff',
        },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          defaultProps: {
            variant: 'contained',
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
