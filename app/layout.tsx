import type { Metadata } from 'next';
import './globals.css';
import { Shell } from '@/components/ui';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Build. Learn. Ship.`, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: { title: SITE_NAME, description: SITE_DESCRIPTION, url: SITE_URL, siteName: SITE_NAME, type: 'website' },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ACM BIT Mesra',
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };
  return <html lang="en"><head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></head><body><Shell>{children}</Shell></body></html>;
}
