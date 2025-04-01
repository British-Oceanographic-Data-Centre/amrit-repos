'use client';

import Link from 'next/link';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { SidebarOption, iconMapping } from '../../types/types';

interface SidebarListItemProps {
  option: SidebarOption;
  open: boolean;
}

export default function SidebarListItem({ option, open }: SidebarListItemProps) {
  const theme = useTheme();
  const pathname = usePathname();

  const path = option === 'Home' ? '/' : `/${option.toLowerCase()}`;
  const isSelected = pathname === path;

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        component={Link}
        href={path}
        selected={isSelected}
        sx={{
          height: 48,
          justifyContent: open ? 'initial' : 'center',
          color: isSelected ? theme.palette.primary.main : 'inherit',
          '&:hover': {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            ml: '4px',
            justifyContent: 'center',
            color: isSelected ? theme.palette.primary.main : 'inherit',
          }}
        >
          {iconMapping[option]}
        </ListItemIcon>
        {open && <ListItemText primary={option} />}
      </ListItemButton>
    </ListItem>
  );
}
