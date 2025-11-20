'use client';

import SectionTabs, { SectionTab } from '@/components/shared/nav/SectionTabs';
import InboxIcon from '@mui/icons-material/Inbox';
import StarIcon from '@mui/icons-material/StarOutlineOutlined';

const alertTabs: SectionTab[] = [
  {
    label: 'INBOX',
    icon: <InboxIcon />,
    path: '/alerts/alerts-table',
  },
  {
    label: 'SUBSCRIPTIONS',
    icon: <StarIcon />,
    path: '/alerts/my-subscriptions',
  },
];

const AlertTabs = () => {
  return <SectionTabs tabs={alertTabs} />;
};

export default AlertTabs;
