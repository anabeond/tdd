import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'El Dojo',
  description: 'The Design Dojo es una comunidad de diseñadores latinoamericanos que aprenden, practican y crecen juntos. Conocé cómo funciona, qué incluye y por qué es diferente.',
  alternates: { canonical: `${SITE_URL}/the-dojo` },
}

import Navbar from '@/components/Navbar'
import TheDojo from '@/components/TheDojo'
import SubscribeSection from '@/components/SubscribeSection'
import Footer from '@/components/Footer'
import { getFeaturedProduct } from '@/lib/products'

export default async function TheDojoPage() {
  const featuredProduct = await getFeaturedProduct()

  return (
    <main className="bg-dark-blue min-h-screen">
      <Navbar />
      <TheDojo featuredProduct={featuredProduct} />
      <SubscribeSection />
      <Footer />
    </main>
  )
}
