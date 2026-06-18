import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'El Dojo',
  description: 'The Design Dojo es una comunidad de diseñadores latinoamericanos que aprenden, practican y crecen juntos. Conocé cómo funciona, qué incluye y por qué es diferente.',
  alternates: { canonical: 'https://thedesigndojo.com/the-dojo' },
}

import Navbar from '@/components/Navbar'
import TheDojo from '@/components/TheDojo'
import SubscribeSection from '@/components/SubscribeSection'
import Footer from '@/components/Footer'

export default function TheDojoPage() {
  return (
    <main className="bg-dark-blue min-h-screen">
      <Navbar />
      <TheDojo />
      <SubscribeSection />
      <Footer />
    </main>
  )
}
