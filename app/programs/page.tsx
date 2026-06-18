import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Programas',
  description: 'Programas intensivos de Diseño UX/UI con acompañamiento grupal, sesiones en vivo y certificado. Para diseñadores latinoamericanos que quieren crecer en serio.',
  alternates: { canonical: 'https://thedesigndojo.com/programs' },
  openGraph: {
    title: 'Programas de Diseño UX/UI | The Design Dojo',
    description: 'Programas intensivos con acompañamiento grupal, sesiones en vivo y certificado.',
  },
}

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SubscribeSection from '@/components/SubscribeSection'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { getPrograms } from '@/lib/products'
import { IconArrowRight, IconUsers, IconVideo, IconCalendarEvent, IconBrandFigma, IconAward } from '@tabler/icons-react'
import Image from 'next/image'
import CTABreak from '@/components/CTABreak'

export default async function ProgramsPage() {
  const programs = await getPrograms()

  return (
    <main className="bg-dark-blue min-h-screen">
      <Navbar />

      {/* ── Page header ── */}
      <section className="px-4 md:px-page pt-28 md:pt-48 pb-8 md:pb-16 flex flex-col gap-8">
        <p className="font-medium text-dojo-white/40 text-[13px] uppercase tracking-[0.1em]">/programas</p>
        <h1
          className="font-semibold text-dojo-white"
          style={{ fontSize: 'clamp(40px, 9vw, 160px)', letterSpacing: '-0.03em', lineHeight: 0.95 }}
        >
          Programas
        </h1>
        <div className="h-px w-full bg-dojo-white/15" />
        <p
          className="font-light text-dojo-white/60 max-w-2xl"
          style={{ fontSize: 'clamp(18px, 1.6vw, 24px)', lineHeight: 1.55, letterSpacing: '-0.02em' }}
        >
          Un Programa va más allá de un curso. Sí, vas a tener contenido grabado para que puedas acceder siempre,
          pero también tendrás acompañamiento grupal y sesiones en vivo.
        </p>
      </section>

      {/* ── Benefits bento ── */}
      <section className="px-4 md:px-page py-12 md:py-24">
        <div className="flex flex-col gap-10">

          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-16">
            <h2
              className="font-medium text-dojo-white max-w-2xl"
              style={{ fontSize: 'clamp(28px, 2.5vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
            >
              Cuando te sumás a un Programa,{' '}
              <span className="font-light text-dojo-white/50">tenés todo esto.</span>
            </h2>
            <div className="shrink-0 pt-1">
              <Button
                href="/the-dojo"
                variant="underline"
                className="text-[18px] text-dojo-white border-accent border-b-2 hover:text-accent whitespace-nowrap"
              >
                Conocé el Dojo
                <IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

            <div className="border border-dojo-white/10 p-8 flex flex-col justify-between gap-6">
              <IconVideo size={40} className="text-dojo-white/60" strokeWidth={1.5} />
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-dojo-white" style={{ fontSize: 'clamp(22px, 1.67vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Horas de video
                </p>
                <p className="font-light text-dojo-white/50" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  Contenido audiovisual que vas a querer ver y que se actualiza todo el tiempo.
                </p>
              </div>
            </div>

            <div className="bg-accent flex items-center justify-center p-10 border border-accent min-h-[160px] sm:min-h-[380px]">
              <p
                className="font-bold text-dojo-white tracking-widest uppercase text-center"
                style={{ fontSize: 'clamp(20px, 1.875vw, 36px)', letterSpacing: '0.12em' }}
              >
                Acompañamiento.
              </p>
            </div>

            <div className="border border-dojo-white/10 p-8 flex flex-col justify-between gap-6">
              <IconCalendarEvent size={40} className="text-dojo-white/60" strokeWidth={1.5} />
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-dojo-white" style={{ fontSize: 'clamp(22px, 1.67vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Sesiones en vivo
                </p>
                <p className="font-light text-dojo-white/50" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  En grupo aprendemos mejor, nos mantenemos al tanto de todo y hay un espacio para preguntar y pedir apoyo.
                </p>
              </div>
            </div>

            <div className="border border-dojo-white/10 p-8 flex flex-col justify-between gap-6">
              <IconUsers size={40} className="text-dojo-white/60" strokeWidth={1.5} />
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-dojo-white" style={{ fontSize: 'clamp(22px, 1.67vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Comunidad
                </p>
                <p className="font-light text-dojo-white/50" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  El propósito es crecer juntos, aprender de cada persona y compartir en el Dojo.
                </p>
              </div>
            </div>

            <div className="border border-dojo-white/10 p-8 flex flex-col justify-between gap-6">
              <IconBrandFigma size={40} className="text-dojo-white/60" strokeWidth={1.5} />
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-dojo-white" style={{ fontSize: 'clamp(22px, 1.67vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Stack de hoy
                </p>
                <p className="font-light text-dojo-white/50" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  Aprendé a usar las herramientas del presente con la mentalidad del futuro.
                </p>
              </div>
            </div>

            <div className="border border-dojo-white/10 p-8 flex flex-col justify-between gap-6">
              <IconAward size={40} className="text-dojo-white/60" strokeWidth={1.5} />
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-dojo-white" style={{ fontSize: 'clamp(22px, 1.67vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Certificado incluido
                </p>
                <p className="font-light text-dojo-white/50" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  Al completar un Programa recibís un certificado de The Design Dojo que podés compartir en tu portfolio y LinkedIn.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <CTABreak
        text="Más Programas en camino."
        buttonLabel="Quiero enterarme →"
        buttonHref="#subscribe"
      />

      {/* ── Programs grid ── */}
      <section className="px-4 md:px-page pb-16 md:pb-32">
        <div className="max-w-[1856px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {programs.map((program) => (
            <a
              key={program.slug}
              href={`/programs/${program.slug}`}
              className="group flex flex-col border border-dojo-white/10"
            >
              {/* Image */}
              <div className="relative w-full overflow-hidden bg-dojo-white/5" style={{ aspectRatio: '16/10' }}>
                {program.heroImage ? (
                  <Image
                    src={program.heroImage}
                    alt={program.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 1856px) 33vw"
                  />
                ) : (
                  <>
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                      }}
                    />
                    <div className="absolute inset-0 flex items-end p-5">
                      <p className="text-dojo-white/20 text-[12px] uppercase tracking-[0.1em]">imagen próximamente</p>
                    </div>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-5 p-8 flex-1 justify-between">
                <div className="flex flex-col gap-3">
                  <p className="font-medium text-dojo-white/40 text-[12px] uppercase tracking-[0.1em]">/{program.badge}</p>
                  <h2
                    className="font-semibold text-dojo-white transition-colors duration-300 group-hover:text-accent"
                    style={{ fontSize: 'clamp(22px, 1.8vw, 30px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
                  >
                    {program.title}
                  </h2>
                  <p
                    className="font-light text-dojo-white/60 flex items-center gap-2"
                    style={{ fontSize: 16, letterSpacing: '-0.02em' }}
                  >
                    <IconArrowRight className="shrink-0" style={{ width: '0.9em', height: '0.9em' }} strokeWidth={1.5} />
                    {program.subtitle}
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap gap-2">
                    {program.duration && <Tag label={program.duration} />}
                    {program.level && <Tag label={program.level} />}
                    {program.format && <Tag label={program.format} />}
                  </div>
                  <div className="h-px bg-dojo-white/10" />
                  <Button
                    href={`/programs/${program.slug}`}
                    variant="underline"
                    className="text-[15px] text-dojo-white border-accent border-b-2 hover:text-accent self-start"
                  >
                    Ver Programa
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
