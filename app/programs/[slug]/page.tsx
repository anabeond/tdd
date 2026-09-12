import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import SubscribeSection from '@/components/SubscribeSection'
import Footer from '@/components/Footer'
import ProgramTemplate from '@/components/Program-Template'
import ComingSoonTemplate from '@/components/ComingSoonTemplate'
import { getProgramBySlug, getComingSoonBySlug } from '@/lib/products'
import { SITE_URL as BASE_URL } from '@/lib/site-config'
import { buildProductFaq, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo'

type ProgramPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params

  const program = await getProgramBySlug(slug)
  if (program) {
    const description = program.subtitle || program.overview.slice(0, 155)
    const images = program.heroImage ? [{ url: program.heroImage, width: 1200, height: 630, alt: program.title }] : []
    return {
      title: program.title,
      description,
      alternates: { canonical: `${BASE_URL}/programs/${slug}` },
      openGraph: { title: program.title, description, images, type: 'website' },
      twitter: { card: 'summary_large_image', title: program.title, description, images: images.map(i => i.url) },
    }
  }

  const comingSoon = await getComingSoonBySlug(slug)
  if (comingSoon) {
    return {
      title: `${comingSoon.title} — Próximamente`,
      description: comingSoon.subtitle || comingSoon.description,
      alternates: { canonical: `${BASE_URL}/programs/${slug}` },
    }
  }

  return { title: 'Programa no encontrado' }
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params

  const program = await getProgramBySlug(slug)
  if (program) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: program.title,
      description: program.subtitle || program.overview,
      url: `${BASE_URL}/programs/${slug}`,
      image: program.heroImage
        ? (program.heroImage.startsWith('http') ? program.heroImage : `${BASE_URL}${program.heroImage}`)
        : undefined,
      provider: { '@type': 'Organization', name: 'The Design Dojo', sameAs: BASE_URL },
      offers: {
        '@type': 'Offer',
        ...(program.priceArs
          ? { price: program.priceArs.replace(/[^0-9]/g, ''), priceCurrency: 'ARS' }
          : {}),
        availability:
          program.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: program.hotmartCheckoutUrl || `${BASE_URL}/programs/${slug}`,
      },
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: program.duration },
    }
    const faqLd = faqJsonLd(
      buildProductFaq(program, program.priceArs ? { amount: program.priceArs, currency: 'ARS' } : null)
    )
    const breadcrumbLd = breadcrumbJsonLd([
      { name: 'Inicio', url: BASE_URL },
      { name: 'Programas', url: `${BASE_URL}/programs` },
      { name: program.title },
    ])
    return (
      <main className="bg-dark-blue min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <Navbar />
        <ProgramTemplate program={program} />
        <SubscribeSection />
        <Footer />
      </main>
    )
  }

  const comingSoon = await getComingSoonBySlug(slug)
  if (comingSoon) {
    return (
      <main className="bg-dark-blue min-h-screen">
        <Navbar />
        <ComingSoonTemplate product={comingSoon} />
        <Footer />
      </main>
    )
  }

  notFound()
}
