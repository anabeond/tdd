'use client'

import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.1 },
  }),
}

const PILLARS = [
  {
    label: 'aprendizaje*',
    text: 'La IA no reemplaza el diseño: amplifica decisiones cuando hay criterio. En The Design Dojo la usamos para acelerar aprendizaje, mejorar procesos y elevar resultados sin perder mirada humana.',
  },
  {
    label: 'diseño*',
    text: 'La IA no reemplaza el diseño: amplifica decisiones cuando hay criterio. En The Design Dojo la usamos para acelerar aprendizaje, mejorar procesos y elevar resultados sin perder mirada humana.',
  },
  {
    label: 'ambiental*',
    text: 'La IA no reemplaza el diseño: amplifica decisiones cuando hay criterio. En The Design Dojo la usamos para acelerar aprendizaje, mejorar procesos y elevar resultados sin perder mirada humana.',
  },
  {
    label: 'futurista*',
    text: 'La IA no reemplaza el diseño: amplifica decisiones cuando hay criterio. En The Design Dojo la usamos para acelerar aprendizaje, mejorar procesos y elevar resultados sin perder mirada humana.',
  },
]

export default function AIApproach() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="w-full px-page flex items-end pb-16" style={{ minHeight: 420, paddingTop: 104 }}>
        <div className="w-full flex items-end justify-between gap-8">
          <motion.h1
            className="font-normal text-dojo-white"
            style={{
              fontSize: 'clamp(40px, 4.375vw, 84px)',
              lineHeight: 1.13,
              letterSpacing: '-0.02em',
              maxWidth: '77%',
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          >
            Nuestra posición frente a la Inteligencia Artificial.
          </motion.h1>

          <motion.p
            className="font-semibold text-accent text-right shrink-0"
            style={{ fontSize: 'clamp(18px, 1.67vw, 32px)', letterSpacing: '-0.04em' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
          >
            /Embrace Human Creativity
          </motion.p>
        </div>
      </section>

      {/* ── Philosophy intro ─────────────────────────────────────────────── */}
      <section className="w-full px-page py-16">
        <motion.div
          className="flex flex-col gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            className="font-medium text-accent"
            style={{ fontSize: 24, letterSpacing: '-0.02em' }}
          >
            filosofía*
          </motion.p>
          <motion.p
            custom={1}
            variants={fadeUp}
            className="font-light text-dojo-white"
            style={{ fontSize: 16, lineHeight: 1.5, letterSpacing: '-0.01em', maxWidth: 860 }}
          >
            La IA no reemplaza el diseño: amplifica decisiones cuando hay criterio. En The Design Dojo la usamos para acelerar aprendizaje, mejorar procesos y elevar resultados sin perder mirada humana.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Pillars grid ─────────────────────────────────────────────────── */}
      <section className="w-full px-page pb-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {PILLARS.map(({ label, text }, i) => (
            <motion.div key={label} custom={i} variants={fadeUp} className="flex flex-col gap-4 max-w-[520px]">
              <p className="font-medium text-accent" style={{ fontSize: 24, letterSpacing: '-0.02em' }}>
                {label}
              </p>
              <p className="font-light text-dojo-white" style={{ fontSize: 16, lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                {text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Date / attribution ───────────────────────────────────────────── */}
      <section className="w-full px-page pb-16">
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="font-medium text-dojo-white/40" style={{ fontSize: 24, letterSpacing: '-0.02em' }}>
            AI Approach
          </p>
          <p className="font-light text-dojo-white/60" style={{ fontSize: 16, lineHeight: 1.5 }}>
            The Design Dojo, Abril, 2026
          </p>
        </motion.div>
      </section>
    </>
  )
}
