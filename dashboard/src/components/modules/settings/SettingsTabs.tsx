'use client';

import SectionTabs, { SectionTab } from '@/components/shared/nav/SectionTabs';
import PersonIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/LockOutlined';

const settingsTabs: SectionTab[] = [
  { label: 'PROFILE',  icon: <PersonIcon />, path: '/settings/profile' },
  { label: 'PASSWORD', icon: <LockIcon />,   path: '/settings/password' },
];

export default function SettingsTabs() {
  return <SectionTabs tabs={settingsTabs} />;
}
