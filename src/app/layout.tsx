import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Locallndex', template: '%s | Locallndex' },
  description: 'The local business visibility and growth intelligence platform. Understand your market, improve your online presence, and outperform competitors.',
  openGraph: {
    title: 'Locallndex',
    description: 'The local business visibility and growth intelligence platform.',
    siteName: 'Locallndex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Locallndex',
    description: 'The local business visibility and growth intelligence platform.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
