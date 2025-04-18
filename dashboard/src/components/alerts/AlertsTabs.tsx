'use client';

import SectionTabs, { SectionTab } from '@/components/SectionTabs';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';

const alertTabs: SectionTab[] = [
  {
    label: 'Alerts table',
    icon: <NotificationsIcon />,
    path: '/alerts/alerts-table',
  },
  {
    label: 'My subscriptions',
    icon: <StarIcon />,
    path: '/alerts/my-subscriptions',
  },
];

const AlertTabs = () => {
  return <SectionTabs tabs={alertTabs} />;
};

export default AlertTabs;
