import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }

import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CheckoutForm from '@/components/CheckoutForm'
import { getProductBySlug } from '@/lib/products'

type CheckoutPageProps = {
  params: Promise<{ slug: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  return (
    <main className="bg-dark-blue min-h-screen">
      <Navbar />
      <section className="px-4 md:px-page pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-[560px] mx-auto">
          <CheckoutForm
            productSlug={product.slug}
            productTitle={product.title}
            price={product.price}
            thinkificUrl={product.thinkificUrl}
          />
        </div>
      </section>
      <Footer />
    </main>
  )
}
