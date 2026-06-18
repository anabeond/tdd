'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

interface CTABreakProps {
  text: string
  buttonLabel: string
  buttonHref: string
  buttonTarget?: string
}

export default function CTABreak({ text, buttonLabel, buttonHref, buttonTarget }: CTABreakProps) {
  return (
    <section className="w-full bg-dojo-white px-8 lg:px-32 py-16">
      <motion.div
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className="font-medium text-dark-blue"
          style={{ fontSize: 'clamp(22px, 2.5vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          {text}
        </p>
        <Button href={buttonHref} target={buttonTarget} variant="secondary">
          {buttonLabel}
        </Button>
      </motion.div>
    </section>
  )
}
