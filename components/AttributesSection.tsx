'use client'

import { motion } from 'framer-motion'
import {
  IconArrowRight,
  IconVideo,
  IconBrandTwitch,
  IconBrandFigma,
  IconClockHour4,
  IconLayoutGrid,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay: i * 0.07 },
  }),
}

function Cell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-dojo-white/10 p-5 md:p-8 flex flex-col justify-between gap-6 ${className}`}>
      {children}
    </div>
  )
}

export default function AttributesSection() {
  return (
    <section className="w-full px-4 md:px-page py-16 md:py-32">
      <motion.div
        className="max-w-[1856px] mx-auto flex flex-col gap-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-16">
          <h2
            className="font-medium text-dojo-white max-w-2xl"
            style={{ fontSize: 'clamp(28px, 2.5vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            La idea del Dojo es acompañar a cada persona en{' '}
            <span className="font-light text-dojo-white/50">su proceso de crecimiento.</span>
          </h2>
          <div className="shrink-0 pt-1">
            <Button
              href="/the-dojo"
              variant="underline"
              className="text-[20px] text-dojo-white border-accent border-b-2 hover:text-accent whitespace-nowrap"
            >
              Filosofía del Dojo
              <IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
            </Button>
          </div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          {/* Row 1 — left */}
          <motion.div custom={1} variants={fadeUp}>
            <Cell className="h-full">
              <IconVideo size={40} className="text-dojo-white/60" strokeWidth={1.5} />
              <div className="flex flex-col gap-2">
                <p
                  className="font-semibold text-dojo-white"
                  style={{ fontSize: 'clamp(22px, 1.67vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
                >
                  Aprendé a tu ritmo
                </p>
                <p className="font-light text-dojo-white/50" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  Tanto Cursos como Programas cuentan con horas de material grabado en video que se actualiza constantemente.
                </p>
              </div>
            </Cell>
          </motion.div>

          {/* Row 1 — center featured */}
          <motion.div custom={2} variants={fadeUp} className="row-span-1">
            <div className="bg-accent h-full min-h-[160px] sm:min-h-[380px] flex items-center justify-center p-10 border border-accent">
              <p
                className="font-bold text-dojo-white tracking-widest uppercase text-center"
                style={{ fontSize: 'clamp(20px, 1.875vw, 36px)', letterSpacing: '0.12em' }}
              >
                ¿Por qué el Dojo?
              </p>
            </div>
          </motion.div>

          {/* Row 1 — right */}
          <motion.div custom={3} variants={fadeUp}>
            <Cell className="h-full">
              <IconLayoutGrid size={40} className="text-dojo-white/60" strokeWidth={1.5} />
              <div className="flex flex-col gap-2">
                <p
                  className="font-semibold text-dojo-white"
                  style={{ fontSize: 'clamp(22px, 1.67vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
                >
                  Programas con Acompañamiento
                </p>
                <p className="font-light text-dojo-white/50" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  Si sentís que algo te traba, podés despejar tus dudas en vivo.
                </p>
              </div>
            </Cell>
          </motion.div>

          {/* Row 2 — left */}
          <motion.div custom={4} variants={fadeUp}>
            <Cell className="h-full">
              <IconClockHour4 size={40} className="text-dojo-white/60" strokeWidth={1.5} />
              <div className="flex flex-col gap-2">
                <p
                  className="font-semibold text-dojo-white"
                  style={{ fontSize: 'clamp(22px, 1.67vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
                >
                  Cursos Cortos / Sprints
                </p>
                <p className="font-light text-dojo-white/50" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  Para aprender habilidades clave en poco tiempo.
                </p>
              </div>
            </Cell>
          </motion.div>

          {/* Row 2 — center */}
          <motion.div custom={5} variants={fadeUp}>
            <Cell className="h-full">
              <IconBrandFigma size={40} className="text-dojo-white/60" strokeWidth={1.5} />
              <div className="flex flex-col gap-2">
                <p
                  className="font-semibold text-dojo-white"
                  style={{ fontSize: 'clamp(22px, 1.67vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
                >
                  Figma, IA y más
                </p>
                <p className="font-light text-dojo-white/50" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  Cada herramienta relevante que necesitas aprender hoy.
                </p>
              </div>
            </Cell>
          </motion.div>

          {/* Row 2 — right */}
          <motion.div custom={6} variants={fadeUp}>
            <Cell className="h-full">
              <IconBrandTwitch size={40} className="text-dojo-white/60" strokeWidth={1.5} />
              <div className="flex flex-col gap-2">
                <p
                  className="font-semibold text-dojo-white"
                  style={{ fontSize: 'clamp(22px, 1.67vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
                >
                  Encuentros en Buenos Aires
                </p>
                <p className="font-light text-dojo-white/50" style={{ fontSize: 16, lineHeight: 1.5 }}>
                  Muy Pronto.
                </p>
              </div>
            </Cell>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}
