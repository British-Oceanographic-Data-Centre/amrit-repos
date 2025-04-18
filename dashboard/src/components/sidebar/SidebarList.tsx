'use client';

import {
  List,
  Collapse,
  Typography,
  useTheme,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';
import SidebarListItem from './SidebarListItem';
import { SidebarOption, iconMapping } from '../../types/types';
import HoverPreview from './HoverPreview';

interface SidebarListProps {
  category: string;
  options: SidebarOption[];
  open: boolean;
}


const SidebarList: React.FC<SidebarListProps> = ({ category, options, open }) => {
  const theme = useTheme();
  
  const initialExpanded: Record<string, boolean> = {};

	options.forEach((opt) => {
	if (typeof opt !== 'string' && opt.children?.length) {
		initialExpanded[opt.label] = true;
	}
	});

  const [expandedSections, setExpandedSections] = useState(initialExpanded);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  return (
    <>
      {category && open && (
        <Typography
          variant="caption"
          sx={{
            pl: 2,
            pt: 2,
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          {category}
        </Typography>
      )}

      <List disablePadding>
        {options.map((option) => {
          const label = typeof option === 'string' ? option : option.label;
		  const children = typeof option === 'string' ? undefined : option.children;
		  
		  if (!children || children.length === 0) {
			return (
			  <SidebarListItem
				key={label}
				option={option}
				open={open}
			  />
			);
		  }

          const isOpen = expandedSections[label] ?? true;

          return (
            <div key={label}>
				<Box
					onMouseEnter={() => setHoveredSection(label)}
					onMouseLeave={() => setHoveredSection(null)}
					sx={{ position: 'relative' }}
				>
					<ListItemButton
						onClick={() => toggleSection(label)}
						sx={{
						height: 48,
						justifyContent: open ? 'initial' : 'center',
						px: 2.5,
						}}
					>
						<ListItemIcon
						sx={{
							minWidth: 0,
							mr: open ? 3 : 'auto',
							justifyContent: 'center',
							color: theme.palette.text.primary,
						}}
						>
						{iconMapping[label]}
						</ListItemIcon>
						{open && (
						<>
							<ListItemText primary={label} />
							{isOpen ? <ExpandLess /> : <ExpandMore />}
						</>
						)}
					</ListItemButton>

					{!open && hoveredSection === label && (
					<HoverPreview
						label={label}
						icon={iconMapping[label]}
						isSelected={false}
						topOffset={0}
						onClick={() => toggleSection(label)}
					/>
					)}

			  </Box>
              {Array.isArray(children) && ( <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {children.map((child) => (
                    <SidebarListItem
					  key={typeof child === 'string' ? child : child.label}
                      option={child}
                      open={open}
                      nested
                    />
                  ))}
                </List>
              </Collapse>
			  )}
            </div>
          );
        })}
      </List>
    </>
  );
};

export default SidebarList;
