import type { Metadata } from 'next';
import { Providers } from './providers';
import { SITE_URL, SITE_DESCRIPTION } from '@/shared/seo';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Transit Desk | Live MBTA Fleet Overview', template: '%s | Transit Desk' },
  description: SITE_DESCRIPTION,
  applicationName: 'Transit Desk',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Transit Desk',
    title: 'Transit Desk | Boston fleet reports',
    description: SITE_DESCRIPTION,
    url: '/',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Transit Desk - Boston fleet reports',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transit Desk | Boston fleet reports',
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
