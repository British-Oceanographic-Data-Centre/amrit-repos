import { Metadata } from 'next';
import Alerts from '../../../components/modules/alerts/Alerts';
import AlertsTabs from '../../../components/modules/alerts/AlertsTabs';
import { Box } from '@mui/material';
export const metadata: Metadata = {
  title: 'Amrit Boards - Alerts',
  description: 'AMRIT Alerts dashboard',
  icons: {
    icon: '/favicon.png',
  },
};

export default function AlertsPage() {
  return (
    <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow:'hidden' }}  >
      <AlertsTabs /><Alerts />
	  </Box>);
}
