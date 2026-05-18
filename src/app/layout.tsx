import type { Metadata } from 'next';
import { wantedSans } from '@/styles/fonts';
import './globals.css';
import './reset.css';
export const metadata: Metadata = {
  title: 'CultruePick',
  description: '컬처픽',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={wantedSans.variable}>
      <body>{children}</body>
    </html>
  );
}
