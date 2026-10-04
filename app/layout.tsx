import './globals.css';
import type { Metadata, Viewport } from 'next';
import { getSession } from '@/lib/auth';
import { getSite } from '@/lib/site';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

const rawBase = process.env.APP_URL || 'http://localhost:3000';
const base = /^https?:\/\//i.test(rawBase) ? rawBase : `https://${rawBase}`;

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: { default: 'Nexora 3D — Conception mécanique, CAO et impression 3D à Tunis', template: '%s · Nexora 3D' },
  description: 'Conception mécanique, modélisation CAO, prototypage et impression 3D à Tunis. Devis en ligne et suivi de projet dans votre espace client.',
  openGraph: { type: 'website', locale: 'fr_TN', siteName: 'Nexora 3D', images: ['/logo.jpg'] },
  icons: { icon: '/logo.jpg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070b10'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, site] = await Promise.all([getSession(), getSite()]);
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a className="skip" href="#contenu">Aller au contenu</a>
        <SiteNav role={session?.role ?? null} logoPath={site.logoPath} />
        <div id="contenu">{children}</div>
        <SiteFooter site={site} />
      </body>
    </html>
  );
}
