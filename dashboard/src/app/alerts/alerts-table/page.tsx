import { Metadata } from 'next';
import Alerts from '../../../components/alerts/Alerts';
import AlertsTabs from '../../../components/alerts/AlertsTabs';
export const metadata: Metadata = {
  title: 'OceanBoards - Alerts',
  description: 'AMRIT Alerts dashboard',
  icons: {
    icon: '/favicon.png',
  },
};

export default function AlertsPage() {
  return (
    <>
      <AlertsTabs /><Alerts />
	</>);
}
