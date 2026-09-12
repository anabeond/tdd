import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Nuestro Approach con IA',
  description: 'En The Design Dojo usamos IA como herramienta creativa, no como reemplazo. Conocé cómo integramos inteligencia artificial en el proceso de enseñanza del diseño.',
  alternates: { canonical: `${SITE_URL}/ai-approach` },
}

import Navbar from '@/components/Navbar'
import AIApproach from '@/components/AIApproach'
import SubscribeSection from '@/components/SubscribeSection'
import Footer from '@/components/Footer'

export default function AIApproachPage() {
  return (
    <main className="bg-dark-blue min-h-screen">
      <Navbar />
      <AIApproach />
      <SubscribeSection />
      <Footer />
    </main>
  )
}