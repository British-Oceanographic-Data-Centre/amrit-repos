'use client';

import { useEffect, useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import MainTopbar from '../components/layout/MainTopbar';
import Sidebar from '../components/layout/sidebar/Sidebar';
import ThemeRegistry from '../theme/ThemeRegistry';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Zustand
import { useAppStore } from '@/store/useAppStore';
import { useShallow } from 'zustand/react/shallow';

dayjs.extend(utc);

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  // Get state with useShallow - Zustand will only re-render if values change
  const { darkMode, sidebarOpen } = useAppStore(
    useShallow((s) => ({
      darkMode: s.ui.darkMode,
      sidebarOpen: s.ui.sidebarOpen,
    }))
  );

  // Get actions separately - they're stable references, no need for shallow
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const setSidebar = useAppStore((s) => s.setSidebar);

  // Prevent hydration mismatch by waiting for client-side hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeRegistry mode={darkMode ? 'dark' : 'light'}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* Hide until mounted to avoid hydration flicker, but keep hooks order stable */}
        <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
          <MainTopbar
            darkMode={darkMode}
            toggleDarkMode={toggleTheme}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebar}
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
        </div>
      </LocalizationProvider>
    </ThemeRegistry>
  );
}
