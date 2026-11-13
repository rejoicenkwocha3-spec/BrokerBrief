import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'BrokerBrief', template: '%s | BrokerBrief' },
  description: 'The AI Operating System for Modern Brokerages. The Intelligence Behind Every Deal.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
