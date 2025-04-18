'use client';

import { Tabs, Tab, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export type SectionTab = {
  label: string;
  icon: React.JSX.Element;
  path: string;
};

interface SectionTabsProps {
  tabs: SectionTab[];
  width?: number;
  centered?: boolean;
}

const SectionTabs: React.FC<SectionTabsProps> = ({ tabs, width = 220, centered = true }) => {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const currentIndex = tabs.findIndex((tab) => pathname === tab.path);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    router.push(tabs[newValue].path);
  };

  return (
    <Tabs
      value={currentIndex}
      onChange={handleChange}
      centered={centered}
      sx={{
        mb: 0,
        borderBottom: `1px solid ${theme.palette.divider}`,
        minHeight: 48,
      }}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={tab.label}
          icon={tab.icon}
          iconPosition="start"
          label={tab.label}
          sx={{
            color: currentIndex === index ? theme.palette.onPrimaryContainer : 'inherit',
            '&:hover': {
              bgcolor: theme.palette.action.hover,
            },
            width,
            minHeight: 48,
            textTransform: 'none',
            height: 1,
          }}
        />
      ))}
    </Tabs>
  );
};

export default SectionTabs;
