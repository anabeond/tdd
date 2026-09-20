import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Cursos',
  description: 'Cursos enfocados de Diseño UX/UI, Figma y Design Systems. Aprendé una habilidad específica a tu ritmo, con proyectos prácticos y certificado.',
  alternates: { canonical: `${SITE_URL}/courses` },
  openGraph: {
    title: 'Cursos de Diseño UX/UI | The Design Dojo',
    description: 'Cursos enfocados de Figma, Design Systems y más. A tu ritmo, con certificado.',
  },
}

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SubscribeSection from '@/components/SubscribeSection'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { ProductImage } from '@/components/ui/ProductImage'
import { getCourses } from '@/lib/products'
import { IconArrowRight } from '@tabler/icons-react'

const PLACEHOLDER = (
  <>
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    />
    <div className="absolute inset-0 flex items-end p-5">
      <p className="text-dojo-white/20 text-[12px] uppercase tracking-[0.1em]">imagen próximamente</p>
    </div>
  </>
)

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <main className="bg-dark-blue min-h-screen">
      <Navbar />

      {/* ── Hero header ── */}
      <section className="px-4 md:px-page pt-28 md:pt-48 pb-0">
        <div className="max-w-[1856px] mx-auto flex flex-col gap-10">
          <p className="font-medium text-dojo-white/40 text-[13px] uppercase tracking-[0.1em]">/cursos</p>

          <h1
            className="font-semibold text-dojo-white"
            style={{ fontSize: 'clamp(40px, 4.5vw, 120px)', letterSpacing: '-0.03em', lineHeight: 0.95 }}
          >
            Aprendé rápidamente un tema interesante de Diseño.
          </h1>

          <div className="h-px w-full bg-dojo-white/15" />

          {/* Intro */}
          <div className="pb-8">
            <p
              className="font-light text-dojo-white/70 max-w-2xl"
              style={{ fontSize: 'clamp(18px, 1.6vw, 26px)', lineHeight: 1.55, letterSpacing: '-0.02em' }}
            >
              La idea de los Cursos o Sprints en el Dojo es que puedas
              adquirir una nueva habilidad de manera práctica en
              cualquier área de Diseño en corto tiempo.
            </p>
          </div>
        </div>
      </section>

      {/* ── Courses grid ── */}
      <section className="px-4 md:px-page pb-16 md:pb-32">
        <div className="max-w-[1856px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {courses.map((course) => (
            <a
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="group flex flex-col border border-dojo-white/10"
            >
              {/* Image */}
              <div
                className="relative w-full overflow-hidden bg-dojo-white/5"
                style={{ aspectRatio: '16/10' }}
              >
                {course.status === 'coming_soon' && (
                  <span className="absolute top-4 left-4 z-10 font-bold text-[12px] uppercase tracking-[0.1em] text-dojo-white bg-dark-blue/80 backdrop-blur-sm px-3 py-1.5">
                    Próximamente
                  </span>
                )}
                <ProductImage
                  src={course.heroImage}
                  alt={course.title}
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 1856px) 33vw"
                  placeholder={PLACEHOLDER}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-5 p-8 flex-1 justify-between">
                <div className="flex flex-col gap-3">
                  <p className="font-medium text-dojo-white/40 text-[12px] uppercase tracking-[0.1em]">/{course.badge}</p>
                  <h2
                    className="font-semibold text-dojo-white transition-colors duration-300 group-hover:text-accent"
                    style={{ fontSize: 'clamp(22px, 1.8vw, 30px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
                  >
                    {course.title}
                  </h2>
                  <p
                    className="font-light text-dojo-white/60 flex items-center gap-2"
                    style={{ fontSize: 16, letterSpacing: '-0.02em' }}
                  >
                    <IconArrowRight className="shrink-0" style={{ width: '0.9em', height: '0.9em' }} strokeWidth={1.5} />
                    {course.subtitle}
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap gap-2">
                    {course.duration && <Tag label={course.duration} />}
                    {course.level && <Tag label={course.level} />}
                  </div>
                  <div className="h-px bg-dojo-white/10" />
                  <Button
                    type="button"
                    variant="underline"
                    className="text-[15px] text-dojo-white border-accent border-b-2 hover:text-accent self-start"
                  >
                    {course.status === 'coming_soon' ? 'Próximamente' : 'Ver Curso'}
                    <IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
                  </Button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <SubscribeSection />
      <Footer />
    </main>
  )
}
