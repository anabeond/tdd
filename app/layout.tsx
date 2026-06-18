import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import AnnouncementBar from '@/components/AnnouncementBar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const BASE_URL = 'https://thedesigndojo.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'The Design Dojo — Aprendé Diseño UX/UI',
    template: '%s | The Design Dojo',
  },
  description: 'Programas, sprints y mentorías de Diseño UX/UI para diseñadores latinoamericanos. Aprendé diseño real, con herramientas reales.',
  keywords: ['diseño ux/ui', 'curso diseño', 'programa ux ui', 'figma', 'diseño latinoamerica', 'aprender diseño'],
  authors: [{ name: 'The Design Dojo', url: BASE_URL }],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
        <ThemeProvider>
          <AnnouncementBar />
          <div style={{ overflowX: 'hidden', position: 'relative' }}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
