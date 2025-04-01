'use client';

import { List, Typography, useTheme } from '@mui/material';
import { SidebarOption } from '../../types/types';
import SidebarListItem from './SidebarListItem';

interface SidebarListProps {
  category: string;
  options: SidebarOption[];
  open: boolean;
}

const SidebarList: React.FC<SidebarListProps> = ({ category, options, open }) => {
  const theme = useTheme();

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
        {options.map((option) => (
          <SidebarListItem key={option} option={option} open={open} />
        ))}
      </List>
    </>
  );
};

export default SidebarList;
