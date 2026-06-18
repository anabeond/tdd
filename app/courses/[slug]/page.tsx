import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CourseTemplate from '@/components/Course-Template'
import ComingSoonTemplate from '@/components/ComingSoonTemplate'
import { getCourseBySlug, getComingSoonBySlug } from '@/lib/products'

const BASE_URL = 'https://thedesigndojo.com'

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
      image: course.heroImage || undefined,
      provider: { '@type': 'Organization', name: 'The Design Dojo', sameAs: BASE_URL },
      offers: {
        '@type': 'Offer',
        price: course.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/checkout/${slug}`,
      },
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: course.duration },
    }
    return (
      <main className="bg-dark-blue min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Navbar />
        <CourseTemplate course={course} />
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
