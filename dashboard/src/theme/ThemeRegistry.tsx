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
        fontWeightMedium:500,
        fontWeightRegular:400,
      },
      palette: {
        mode,
        primary: {
          main: mode === 'light' ? '#007b8a' : '#4DB1B5',
          contrastText: mode === 'dark' ? '#000000' : '#ffffff',
        },
        secondary: {
          main: mode === 'dark' ? '#FFB74D' : '#F57C00',
        },
        background: {
          default: mode === 'dark' ? '#121212' : '#fdfdfd',
          paper: mode === 'dark' ? '#1E1E1E' : '#ffffff',
        },
		primaryContainer: mode === 'light' ? '#d9f1f3' : '#205a5e',  // lighter bg
		onPrimaryContainer: mode === 'light' ? '#006a7c' : '#e0f7f8', // high contrast text
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
