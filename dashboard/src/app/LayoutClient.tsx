'use client';

import { useEffect, useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import MainTopbar from '../components/MainTopbar';
import Sidebar from '../components/sidebar/Sidebar';
import ThemeRegistry from '../theme/ThemeRegistry';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  return ( 
    <ThemeRegistry mode={darkMode ? 'dark' : 'light'}>
      <CssBaseline />

      <MainTopbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode((prev) => !prev)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', mt: '64px' }}>
        <Sidebar darkMode={darkMode} open={sidebarOpen} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeRegistry>
  );
}
