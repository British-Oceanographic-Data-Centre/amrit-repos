'use client';

import Link from 'next/link';
import {
  Box, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { iconMapping, SidebarItem } from '../../../types/types';
import HoverPreview from './HoverPreview';
import { useState, useEffect } from 'react';

interface SidebarListItemProps {
  option: string | SidebarItem;
  open: boolean;
  nested?: boolean;
}

export default function SidebarListItem({ option, open, nested = false }: SidebarListItemProps) {
  const theme = useTheme();
  const pathnameRaw = usePathname() || '';
  const pathname = pathnameRaw.toLowerCase();

  const label = typeof option === 'string' ? option : option.label;
  const path =
    typeof option === 'string'
      ? (option === 'Home' ? '/' : `/${option.toLowerCase().replace(/\s+/g, '-')}`)
      : option.path ?? `/${label.toLowerCase().replace(/\s+/g, '-')}`;

  // derive section base from the first path segment, e.g. '/alerts'
  const toSectionBase = (p: string) => {
    const parts = p.split('/').filter(Boolean); // remove empty segments
    return parts.length ? `/${parts[0]}` : '/';
  };

  const sectionBase = toSectionBase(path.toLowerCase());
  const currentSectionBase = toSectionBase(pathname);

  // active if we are at the section root or anywhere under it
  const isActive = currentSectionBase === sectionBase;

  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{ position: 'relative' }}
    >
      <ListItem disablePadding sx={{ display: 'block', position: 'relative' }}>
        <ListItemButton
          component={Link}
          href={path}
          selected={isActive}
          sx={{
            height: 48,
            justifyContent: open ? 'initial' : 'center',
            bgcolor: isActive ? theme.palette.primaryContainer : 'transparent',
            color: isActive ? theme.palette.onPrimaryContainer : 'inherit',
            '&:hover': { bgcolor: theme.palette.action.hover },
            pl: nested ? (open ? 5 : 2.5) : (open ? 2.5 : 2.5),
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              color: isActive ? theme.palette.onPrimaryContainer : 'inherit',
            }}
          >
            {iconMapping[label]}
          </ListItemIcon>
          {open && <ListItemText primary={label} />}
        </ListItemButton>
      </ListItem>

      {mounted && !open && hovered && (
        <HoverPreview
          label={label}
          icon={iconMapping[label]}
          path={path}
          isSelected={isActive}
          topOffset={0}
        />
      )}
    </Box>
  );
}
