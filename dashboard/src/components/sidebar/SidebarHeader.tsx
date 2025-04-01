'use client';

import { IconButton, Box, useTheme } from '@mui/material';
import { ChevronLeft, Menu as MenuIcon } from '@mui/icons-material';

interface SidebarHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ open, setOpen }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 1.5,
        py: 1,
        color: theme.palette.primary.main,
      }}
    >
      <IconButton
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        size="small"
      >
        {open ? <ChevronLeft /> : <MenuIcon />}
      </IconButton>
    </Box>
  );
};

export default SidebarHeader;
