'use client'

import { useRef } from 'react'
import { motion, useInView, useMotionValue, useAnimationFrame } from 'framer-motion'
import {
  IconBlur,
  IconVocabulary,
  IconSparkles,
  IconPlayHandball,
} from '@tabler/icons-react'
import DojoBreak from '@/components/DojoBreak'
import BreakPicture from '@/components/BreakPicture'
import CTABreak from '@/components/CTABreak'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const WORDS = [
  'Branding', 'Deal With Clients', 'Prototypes', 'Typography', 'Design Principles',
  'Adobe Is Boring', 'Handoff for Devs', 'Use Auto Layouts', 'Think About The User', 'Defining Budgets',
  'I Love Figma', 'Userflows', 'Design With AI', 'Update Your Portfolio', 'Iterate With Users',
  'Product Designer', 'Use Frames', 'Make Design Systems', 'Comments on Figma', 'Deadlines',
  'AI Everywhere', 'Feedback Call', 'Freelos', 'Drawing for Fun', 'Design With Claude',
  'Who Ever Thinks About The Designers?',
]

const VALUES = [
  {
    Icon: IconBlur,
    label: 'eye to the detail*',
    line1: 'Respetamos los',
    line2: 'Principios del Diseño.',
  },
  {
    Icon: IconVocabulary,
    label: 'sharing*',
    line1: 'Compartimos el',
    line2: 'conocimiento.',
  },
  {
    Icon: IconSparkles,
    label: 'embrace tech*',
    line1: 'Diseño y Tecnología',
    line2: 'siempre unidos.',
  },
  {
    Icon: IconPlayHandball,
    label: 'commitment*',
    line1: 'Compromiso a la',
    line2: 'mejora constante.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.1 },
  }),
}

// ── 1. HERO ──────────────────────────────────────────────────────────────────
function DojoHero() {
  return (
    <section className="w-full min-h-[500px] md:h-[800px] flex items-end px-4 md:px-page pb-16 pt-32 md:pt-0">
      <div className="w-full flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <motion.h1
          className="font-normal text-dojo-white"
          style={{
            fontSize: 'clamp(56px, 6.67vw, 128px)',
            lineHeight: 1.13,
            letterSpacing: '-0.02em',
          }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
        >
          Un espacio para quienes vivimos el diseño cada día.
        </motion.h1>

        <motion.p
          className="font-semibold text-accent md:text-right md:shrink-0"
          style={{ fontSize: 'clamp(18px, 1.67vw, 32px)', letterSpacing: '-0.04em' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
        >
          /Committed to Design.
        </motion.p>
      </div>
    </section>
  )
}

// ── 2. VALUES ─────────────────────────────────────────────────────────────────
function DojoValues() {
  return (
    <section className="w-full px-page py-32">
      <motion.div
        className="max-w-[1856px] mx-auto flex flex-col gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.h2
          custom={0}
          variants={fadeUp}
          className="font-normal text-dojo-white"
          style={{
            fontSize: 'clamp(48px, 4.375vw, 84px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          /lo que nos define
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 pt-8">
          {VALUES.map(({ Icon, label, line1, line2 }, i) => (
            <motion.div
              key={label}
              custom={i + 1}
              variants={fadeUp}
              className="flex flex-col gap-4"
            >
              <Icon size={24} className="text-dojo-white" strokeWidth={1.5} />
              <p
                className="font-medium text-accent"
                style={{ fontSize: 24, letterSpacing: '-0.02em' }}
              >
                {label}
              </p>
              <div
                className="font-light text-dojo-white"
                style={{ fontSize: 'clamp(24px, 2.08vw, 40px)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
              >
                <p>{line1}</p>
                <p>{line2}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// ── 3. WORD CAROUSEL ──────────────────────────────────────────────────────────
function DojoWordCarousel() {
  const x = useMotionValue(0)
  const ref = useRef<HTMLDivElement>(null)

  useAnimationFrame((_, delta) => {
    if (!ref.current) return
    const halfWidth = ref.current.scrollWidth / 2
    const next = x.get() - delta * 0.05
    x.set(next <= -halfWidth ? next + halfWidth : next)
  })

  return (
    <div className="w-full bg-accent overflow-hidden py-1">
      <motion.div
        ref={ref}
        style={{ x }}
        className="flex items-center whitespace-nowrap"
      >
        {[...WORDS, ...WORDS].map((word, i) => (
          <span
            key={i}
            className="font-semibold text-dark-blue uppercase shrink-0 px-3"
            style={{ fontSize: 16, letterSpacing: '0.175em' }}
          >
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── 4. WHY DOJO ───────────────────────────────────────────────────────────────
function DojoWhy() {
  return (
    <section className="w-full px-4 md:px-page flex items-center pt-16 md:pt-0" style={{ minHeight: 540 }}>
      <motion.div
        className="w-full flex flex-col gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {/* Brand symbol */}
        <motion.div custom={0} variants={fadeUp} className="size-12 shrink-0">
          <img src="/images/logo-footer.svg" alt="" className="w-full h-full object-contain" />
        </motion.div>

        {/* Question + Answer */}
        <div className="flex items-end justify-between w-full flex-wrap gap-4">
          <motion.p
            custom={1}
            variants={fadeUp}
            className="font-normal text-dojo-white"
            style={{ fontSize: 'clamp(28px, 5vw, 84px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
          >
            ¿Por qué Dojo?
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            className="flex items-baseline gap-2"
          >
            {['Practicá.', 'Aprendé.'].map((word) => (
              <span
                key={word}
                className="font-normal text-dojo-white"
                style={{ fontSize: 'clamp(28px, 5vw, 84px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
              >
                {word}
              </span>
            ))}
            <span
              className="font-semibold text-accent"
              style={{ fontSize: 'clamp(28px, 5vw, 84px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
            >
              Avanzá.
            </span>
          </motion.div>
        </div>

        {/* Paragraphs */}
        <div className="flex gap-8 max-w-[760px]">
          <motion.p
            custom={2}
            variants={fadeUp}
            className="font-medium text-dojo-white/50 flex-1"
            style={{ fontSize: 16, lineHeight: 1.625, letterSpacing: '-0.02em' }}
          >
            La filosofía detrás de un Dojo está enfocada en ser un espacio para practicar, equivocarse, recibir corrección, volver al día siguiente y tener diferentes resultados.
          </motion.p>
          <motion.p
            custom={3}
            variants={fadeUp}
            className="flex-1"
            style={{ fontSize: 16, lineHeight: 1.625, letterSpacing: '-0.02em' }}
          >
            <span className="font-medium text-dojo-white/50">
              Ser mejor cada día a través de la práctica continua.{' '}
            </span>
            <span className="font-medium text-dojo-white/80">
              En eso creemos y por eso existe Design Dojo.
            </span>
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}


// ── 6. QUOTE — typewriter ─────────────────────────────────────────────────────
type QuotePart = { text: string; accent: boolean }

const QUOTE_PARTS: QuotePart[] = [
  { text: 'El Dojo nació de 16 años viviendo del diseño, enseñando, hablando de él y de entender que ', accent: false },
  { text: 'debemos', accent: false },
  { text: ' compartir lo que sabemos.', accent: true },
]

// Pre-compute char array with color info
const QUOTE_CHARS = QUOTE_PARTS.flatMap(({ text, accent }) =>
  text.split('').map((char) => ({ char, accent }))
)

function TypewriterQuote() {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <p
      ref={ref}
      style={{ fontSize: 'clamp(26px, 2.5vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.33 }}
    >
      {QUOTE_CHARS.map(({ char, accent }, i) => (
        <motion.span
          key={i}
          className={accent ? 'text-accent' : 'text-dojo-white'}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: i * 0.01, duration: 0.04 }}
        >
          {char}
        </motion.span>
      ))}
    </p>
  )
}

function DojoQuote() {
  return (
    <section className="w-full flex flex-col md:flex-row md:items-stretch">
      {/* Photo */}
      <div className="relative w-full h-[360px] shrink-0 overflow-hidden md:w-[480px] md:h-auto md:min-h-[800px]">
        <img
          src="/images/anabeond.png"
          alt="Ani Wilhelm"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/80 mix-blend-color" />
        <div className="absolute inset-0 bg-black/50 mix-blend-soft-light" />
      </div>

      {/* Quote */}
      <motion.div
        className="flex-1 flex flex-col justify-center gap-4 px-4 md:px-page py-12 md:py-16"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <TypewriterQuote />
        <p
          className="font-normal text-dojo-white/50 uppercase tracking-[0.12em]"
          style={{ fontSize: 16 }}
        >
          Ani Wilhelm, the creator.
        </p>
      </motion.div>
    </section>
  )
}



// ── 9. CLOSE ──────────────────────────────────────────────────────────────────
function DojoClose() {
  return (
    <section className="w-full px-page flex items-center" style={{ height: 320 }}>
      <motion.p
        className="font-normal text-dojo-white w-full"
        style={{ fontSize: 'clamp(56px, 4.375vw, 32px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        Do it for Design.
      </motion.p>
    </section>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function TheDojo() {
  return (
    <>
      <DojoHero />
      <DojoValues />
      <DojoWordCarousel />
      <DojoWhy />
      <DojoBreak />
      <DojoQuote />
      <BreakPicture />
      <CTABreak
        text="¿Querés ser parte de la construcción del Dojo?"
        buttonLabel="Hablemos →"
        buttonHref="https://docs.google.com/forms/d/e/1FAIpQLSdtNsAKm3HnhdmksOCmfmp5lEGE38V-LtzOOXMtc-glVSx07Q/viewform?usp=preview"
        buttonTarget="_blank"
      />
      <DojoClose />
    </>
  )
}
