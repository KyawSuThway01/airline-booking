import type { Metadata } from 'next';
import './globals.css';
import ChatWidget from '@/components/ChatWidget';

export const metadata: Metadata = {
  title: 'DairyFlat Air',
  description: 'Premium flights from Dairy Flat Airport',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}