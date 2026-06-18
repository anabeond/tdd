import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cursos',
  description: 'Cursos enfocados de Diseño UX/UI, Figma y Design Systems. Aprendé una habilidad específica a tu ritmo, con proyectos prácticos y certificado.',
  alternates: { canonical: 'https://thedesigndojo.com/courses' },
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
import { getCourses } from '@/lib/products'
import { IconArrowRight, IconVideo, IconClockHour4, IconBolt, IconCertificate } from '@tabler/icons-react'
import Image from 'next/image'

const INCLUDES = [
  { icon: IconVideo, label: 'Clases en video' },
  { icon: IconClockHour4, label: 'A tu ritmo' },
  { icon: IconBolt, label: 'Proyectos prácticos' },
  { icon: IconCertificate, label: 'Certificado' },
]

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
            style={{ fontSize: 'clamp(40px, 9vw, 160px)', letterSpacing: '-0.03em', lineHeight: 0.95 }}
          >
            Cursos
          </h1>

          <div className="h-px w-full bg-dojo-white/15" />

          {/* 2-col intro */}
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16 pb-8">
            <p
              className="font-light text-dojo-white/70 max-w-2xl"
              style={{ fontSize: 'clamp(18px, 1.6vw, 26px)', lineHeight: 1.55, letterSpacing: '-0.02em' }}
            >
              Los cursos son sprints enfocados. Elegís una habilidad, la trabajás en
              profundidad y salís con algo concreto. Sin rodeos, sin relleno: solo lo
              que necesitás aprender hoy.
            </p>

            {/* Includes list — right-aligned */}
            <div className="md:shrink-0 flex flex-col gap-3 md:items-end">
              <p className="text-dojo-white/30 text-[12px] uppercase tracking-[0.1em] mb-1">Todos incluyen</p>
              {INCLUDES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-dojo-white/70 text-[15px] font-medium">{label}</span>
                  <Icon size={18} className="text-accent" strokeWidth={1.7} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Concept block: courses ≠ programs ── */}
      <section className="px-4 md:px-page py-12 md:py-24">
        <div className="max-w-[1856px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 border border-dojo-white/10">
          {/* Text — left */}
          <div className="flex flex-col justify-between gap-10 p-8 md:p-16 border-b md:border-b-0 md:border-r border-dojo-white/10">
            <div className="flex flex-col gap-6">
              <p className="font-medium text-accent text-[13px] uppercase tracking-[0.1em]">¿Para qué sirve un curso?</p>
              <h2
                className="font-semibold text-dojo-white"
                style={{ fontSize: 'clamp(28px, 2.5vw, 44px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
              >
                Una habilidad nueva en poco tiempo. Sin excusas.
              </h2>
              <p className="font-light text-dojo-white/55 text-[16px] leading-[1.65]">
                Cada curso está construido alrededor de una herramienta o concepto
                específico. Podés tomarlo solo o combinarlo con un programa para ir más
                profundo. El ritmo lo manejás vos.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-px bg-dojo-white/10" />
              <div className="flex items-center justify-between">
                <p className="text-dojo-white/40 text-[14px]">Duración estimada</p>
                <p className="text-dojo-white font-semibold text-[14px]">2 – 6 semanas</p>
              </div>
              <div className="h-px bg-dojo-white/10" />
              <div className="flex items-center justify-between">
                <p className="text-dojo-white/40 text-[14px]">Modalidad</p>
                <p className="text-dojo-white font-semibold text-[14px]">100% Online</p>
              </div>
              <div className="h-px bg-dojo-white/10" />
            </div>
          </div>

          {/* Image placeholder — right */}
          <div className="relative w-full bg-dojo-white/5 overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-dojo-white/20 text-[13px] uppercase tracking-[0.1em]">imagen próximamente</p>
            </div>
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
                {course.heroImage ? (
                  <Image
                    src={course.heroImage}
                    alt={course.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 1856px) 33vw"
                  />
                ) : (
                  PLACEHOLDER
                )}
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
                    href={`/courses/${course.slug}`}
                    variant="underline"
                    className="text-[15px] text-dojo-white border-accent border-b-2 hover:text-accent self-start"
                  >
                    Ver Curso
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
