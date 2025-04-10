import type { Metadata } from 'next';
import './globals.css';
import '@fontsource/quicksand/400.css';
import '@fontsource/lexend/400.css';
import LayoutClient from './LayoutClient';

export const metadata: Metadata = {
  title: 'OceanBoards',
  description: 'AMRIT dashboards application',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode  }) {
  return (
    <html lang="en">
      <body>
          <LayoutClient>
            {children}
            {modal}           
            </LayoutClient>
      </body>
    </html>
  );
}
