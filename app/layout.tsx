import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClearPath Insurance | Your Independent Broker',
  description: 'Find the right home, auto, or health insurance with a trusted independent broker. Get a free quote in minutes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
