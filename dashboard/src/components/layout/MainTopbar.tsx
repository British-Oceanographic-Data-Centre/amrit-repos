'use client';

import React from 'react';
import {
  AppBar, Toolbar, Box, IconButton, Typography, Button, useTheme,
  Tooltip, Menu, MenuItem, ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccountCircle, Logout, Settings } from '@mui/icons-material';
import DarkModeToggle from './DarkModeToggle';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface MainTopbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

type Session = { isAuth: boolean; username?: string | null };

const MainTopbar: React.FC<MainTopbarProps> = ({
  darkMode,
  toggleDarkMode,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);
  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget);
  const handleCloseMenu = () => setMenuAnchor(null);

  const [session, setSession] = React.useState<Session>({ isAuth: false, username: null });
  const [loading, setLoading] = React.useState(true);

  // refetch session on mount AND whenever the route changes
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/session', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        const data = (await res.json()) as Session;
        if (alive) setSession({ isAuth: !!data?.isAuth, username: data?.username ?? null });
      } catch {
        if (alive) setSession({ isAuth: false, username: null });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [pathname]); // 👈 important

  const refetchSession = React.useCallback(async () => {
    try {
      const res = await fetch('/api/session', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });
      const data = (await res.json()) as Session;
      setSession({ isAuth: !!data?.isAuth, username: data?.username ?? null });
    } catch {
      setSession({ isAuth: false, username: null });
    }
  }, []);

  const handleLogout = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleCloseMenu();

    // Optimistic UI
    setSession({ isAuth: false, username: null });

    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include', cache: 'no-store' });
    } catch { /* ignore */ }

    // Re-sync client state with server once
    await refetchSession();

    // Go to a neutral page to avoid your /login redirect logic
    router.replace('/');
    router.refresh();
  };

  const { isAuth, username } = session;

  const hideLoginOnThisRoute = pathname === '/login' || pathname === '/signup';

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: { xs: 2, sm: 0 } }}>
          <IconButton
            edge="start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{ mr: 1 }}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            sx={{
              fontFamily: '"Quicksand", sans-serif',
              display: 'flex',
              alignItems: 'center',
              ml: 1,
              fontWeight: 500,
              mt: -0.7,
              letterSpacing: '0px',
              color: '#4cb2b6',
            }}
          >
            <Box
              component="img"
              src="/img/amrit-logo-name.png"
              alt="Amrit logo"
              sx={{ height: '1.4rem', mr: 0.3, display: 'inline-block' }}
            />
          </Typography>
        </Box>

        {/* Right side: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!loading && !isAuth && !hideLoginOnThisRoute ? (
            <Button
              component={Link}
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
              href="/login"
            >
              Login
            </Button>
          ) : null}

          {!loading && isAuth ? (
            <>
              <Tooltip title="User options">
                <Button
                  onClick={handleOpenMenu}
                  aria-controls={menuOpen ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? 'true' : undefined}
                  startIcon={<AccountCircle />}
                  endIcon={<ExpandMoreIcon />}
                >
                  <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>
                    {username}
                  </Typography>
                </Button>
              </Tooltip>

              <Menu
                anchorEl={menuAnchor}
                id="account-menu"
                open={menuOpen}
                onClose={handleCloseMenu}
                onClick={handleCloseMenu}
                PaperProps={{ elevation: 3, sx: { mt: 1.5, minWidth: 220 } }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem component={Link} href="/settings/profile">
                  <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                  Log out
                </MenuItem>
              </Menu>
            </>
          ) : null}

          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MainTopbar;
