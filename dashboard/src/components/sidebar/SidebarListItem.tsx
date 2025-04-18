'use client';

import Link from 'next/link';
import {
	Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { iconMapping, SidebarItem } from '../../types/types';
import HoverPreview from './HoverPreview';
import { useState, useEffect } from 'react';

interface SidebarListItemProps {
	option: string | SidebarItem;
	open: boolean;
	nested?: boolean;
  }
  
  export default function SidebarListItem({ option, open, nested = false }: SidebarListItemProps) {
	const theme = useTheme();
	const pathname = usePathname();
	const label = typeof option === 'string' ? option : option.label;
	const path = typeof option === 'string'
	  ? (option === 'Home' ? '/' : `/${option.toLowerCase().replace(/\s+/g, '-')}`)
	  : option.path ?? `/${label.toLowerCase().replace(/\s+/g, '-')}`;
	const isSelected = pathname === path;
	
	const [hovered, setHovered] = useState(false);
  
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
	setMounted(true);
	}, []);

	return (
		
		<Box
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			sx={{ position: 'relative' }}
		>
			<ListItem
			disablePadding
			sx={{
				display: 'block',
				position: 'relative',
			}}
			>
					<ListItemButton
						component={Link}
						href={path}
						selected={isSelected}
						sx={{
						height: 48,
						justifyContent: open ? 'initial' : 'center',
						bgcolor: isSelected ? theme.palette.primaryContainer : 'transparent',
						color: isSelected ? theme.palette.onPrimaryContainer : 'inherit',
						'&:hover': {
							bgcolor: theme.palette.action.hover,
						},
						pl: nested ? (open ? 5 : 2.5) : (open ? 2.5 : 2.5),
						}}
					>
						<ListItemIcon
						sx={{
							minWidth: 0,
							mr: open ? 3 : 'auto',
							justifyContent: 'center',
							color: isSelected ? theme.palette.onPrimaryContainer : 'inherit',
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
				isSelected={isSelected}
				topOffset={0}
				/>
			)}
		</Box>
	);
  }
  