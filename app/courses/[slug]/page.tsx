import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import SubscribeSection from '@/components/SubscribeSection'
import Footer from '@/components/Footer'
import CourseTemplate from '@/components/Course-Template'
import ComingSoonTemplate from '@/components/ComingSoonTemplate'
import { getCourseBySlug, getComingSoonBySlug } from '@/lib/products'
import { SITE_URL as BASE_URL } from '@/lib/site-config'
import { buildProductFaq, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo'

type CoursePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params

  const course = await getCourseBySlug(slug)
  if (course) {
    const description = course.subtitle || course.overview.slice(0, 155)
    const images = course.heroImage ? [{ url: course.heroImage, width: 1200, height: 630, alt: course.title }] : []
    return {
      title: course.title,
      description,
      alternates: { canonical: `${BASE_URL}/courses/${slug}` },
      openGraph: { title: course.title, description, images, type: 'website' },
      twitter: { card: 'summary_large_image', title: course.title, description, images: images.map(i => i.url) },
    }
  }

  const comingSoon = await getComingSoonBySlug(slug)
  if (comingSoon) {
    return {
      title: `${comingSoon.title} — Próximamente`,
      description: comingSoon.subtitle || comingSoon.description,
      alternates: { canonical: `${BASE_URL}/courses/${slug}` },
    }
  }

  return { title: 'Curso no encontrado' }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params

  const course = await getCourseBySlug(slug)
  if (course) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.subtitle || course.overview,
      url: `${BASE_URL}/courses/${slug}`,
      image: course.heroImage
        ? (course.heroImage.startsWith('http') ? course.heroImage : `${BASE_URL}${course.heroImage}`)
        : undefined,
      provider: { '@type': 'Organization', name: 'The Design Dojo', sameAs: BASE_URL },
      offers: {
        '@type': 'Offer',
        ...(course.priceUsd
          ? { price: course.priceUsd.replace(/[^0-9]/g, ''), priceCurrency: 'USD' }
          : {}),
        availability:
          course.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: course.hotmartCheckoutUrl || `${BASE_URL}/courses/${slug}`,
      },
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: course.duration },
    }
    const faqLd = faqJsonLd(
      buildProductFaq(course, course.priceUsd ? { amount: course.priceUsd, currency: 'USD' } : null)
    )
    const breadcrumbLd = breadcrumbJsonLd([
      { name: 'Inicio', url: BASE_URL },
      { name: 'Cursos', url: `${BASE_URL}/courses` },
      { name: course.title },
    ])
    return (
      <main className="bg-dark-blue min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <Navbar />
        <CourseTemplate course={course} />
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
