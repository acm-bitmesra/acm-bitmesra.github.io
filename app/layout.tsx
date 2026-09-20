import type { Metadata } from 'next';
import './globals.css';
import { Shell } from '@/components/ui';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME + ' — Build. Learn. Ship.', template: '%s — ' + SITE_NAME },
  description: SITE_DESCRIPTION,
  keywords: ['ACM BIT Mesra','BIT Mesra ACM','Ranchi technology community','student projects','open source','research','hackathons'],
  alternates: { canonical: SITE_URL },
  openGraph: { title: SITE_NAME, description: SITE_DESCRIPTION, url: SITE_URL, siteName: SITE_NAME, type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
  themeColor: '#080808',
};

export default function RootLayout({children}:{readonly children:React.ReactNode}) {
  const structuredData=[
    {'@context':'https://schema.org','@type':'Organization',name:'ACM BIT Mesra',url:SITE_URL,description:SITE_DESCRIPTION},
    {'@context':'https://schema.org','@type':'WebSite',name:SITE_NAME,url:SITE_URL,inLanguage:'en-IN'},
  ];
  return <html lang="en"><head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/></head><body><a className="skip-link" href="#main">Skip to content</a><Shell>{children}</Shell></body></html>;
}
