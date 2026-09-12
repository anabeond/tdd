import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import AnnouncementBar from '@/components/AnnouncementBar'
import { CookieConsentProvider, CookieConsentBanner } from '@/components/CookieConsent'
import AnalyticsGate from '@/components/AnalyticsGate'
import { SITE_URL, SITE_NAME, SOCIAL_LINKS } from '@/lib/site-config'

const newBlack = localFont({
  src: [
    { path: './fonts/NewBlackTypeface-UltraLight.ttf', weight: '200', style: 'normal' },
    { path: './fonts/NewBlackTypeface-Light.ttf', weight: '300', style: 'normal' },
    { path: './fonts/NewBlackTypeface-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/NewBlackTypeface-Medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/NewBlackTypeface-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: './fonts/NewBlackTypeface-Bold.ttf', weight: '700', style: 'normal' },
    { path: './fonts/NewBlackTypeface-ExtraBold.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-newblack',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'The Design Dojo — Aprendé Diseño UX/UI',
    template: '%s | The Design Dojo',
  },
  description: 'Programas, sprints y mentorías de Diseño UX/UI para diseñadores latinoamericanos. Aprendé diseño real, con herramientas reales.',
  keywords: ['diseño ux/ui', 'curso diseño', 'programa ux ui', 'figma', 'diseño latinoamerica', 'aprender diseño'],
  authors: [{ name: 'The Design Dojo', url: SITE_URL }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'The Design Dojo',
    title: 'The Design Dojo — Aprendé Diseño UX/UI',
    description: 'Programas, sprints y mentorías de Diseño UX/UI para diseñadores latinoamericanos.',
    images: [{ url: '/images/programs-card-1.jpg', width: 1200, height: 630, alt: 'The Design Dojo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Design Dojo — Aprendé Diseño UX/UI',
    description: 'Programas, sprints y mentorías de Diseño UX/UI para diseñadores latinoamericanos.',
    images: ['/images/programs-card-1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-navbar.svg`,
  sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.twitch, SOCIAL_LINKS.figma],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={newBlack.variable}>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <ThemeProvider>
          <CookieConsentProvider>
            <AnnouncementBar />
            <CookieConsentBanner />
            <AnalyticsGate />
            <div style={{ overflowX: 'hidden', position: 'relative' }}>
              {children}
            </div>
          </CookieConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
