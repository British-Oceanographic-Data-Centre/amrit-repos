import { Metadata } from 'next';
import Alerts from '../../components/Alerts';

export const metadata: Metadata = {
  title: 'OceanBoards - Alerts',
  description: 'AMRIT dashboards application',
  icons: {
    icon: '/favicon.png',
  },
};

export default function AlertsPage() {
  return <Alerts />;
}
