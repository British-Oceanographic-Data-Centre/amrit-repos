'use client';

import Link from 'next/link';
import { Box, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { JSX } from 'react';
import { useEffect, useState } from 'react';

interface HoverPreviewProps {
	label: string;
	icon: JSX.Element;
	path?: string;
	isSelected: boolean;
	topOffset: number;
	onClick?: () => void;
  }

const HoverPreview: React.FC<HoverPreviewProps> = ({ label, icon, path, isSelected, onClick }) => {
  const theme = useTheme();
  
  const [visible, setVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setVisible(true), 1); // allow next tick for smooth mount
		return () => clearTimeout(timeout);
	}, []);

	  

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        zIndex: 9999,
        width: 280,
		left: 0, 
        boxShadow: 0.5,
        bgcolor: isSelected ? theme.palette.primaryContainer : theme.palette.background.paper,
        borderRadius: 0,
		transform: visible ? 'translateX(0px)' : 'translateX(-16px)', // 👈 slide in
		transition: 'opacity 0.2s ease-out, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
		pointerEvents: 'auto',
		opacity: visible ? 1 : 0,

      }}
    >
		<ListItemButton
		component={path ? Link : 'div'}
		{...(path ? { href: path } : { onClick })}
		selected={isSelected}
		sx={{
			height: 48,
			px: 2.5,
			color: isSelected ? theme.palette.onPrimaryContainer : 'inherit',
			'&:hover': {
			bgcolor: theme.palette.action.hover,
			},
		}}
		>
        <ListItemIcon
          sx={{
            minWidth: 32,
            mr: 2,
            color: isSelected ? theme.palette.onPrimaryContainer : 'inherit',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </Box>
  );
};

export default HoverPreview;
