'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { IconMoodSmile, IconArrowRight } from '@tabler/icons-react'

export default function MentorshipsSection() {
  return (
    <section className="w-full px-4 md:px-page py-16 md:py-24">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16 max-w-[1856px] mx-auto">
        {/* Text */}
        <motion.div
          className="flex flex-col gap-4 flex-1"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Label */}
          <p
            className="font-semibold text-dojo-white"
            style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', letterSpacing: '-0.64px' }}
          >
            <span>Próximamente </span>
            <span className="font-normal">/m</span>
            <span className="font-light">entorías 1:1</span>
          </p>

          {/* Headline */}
          <h2
            className="font-medium text-dojo-white"
            style={{
              fontSize: 'clamp(36px, 3.33vw, 64px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Si has sentido soledad en tu camino
            <br />
            del diseño, te acompañamos.
          </h2>

          {/* Tagline */}
          <p
            className="font-light text-dojo-white/50 flex items-center gap-3"
            style={{
              fontSize: 'clamp(28px, 2.5vw, 48px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            <IconMoodSmile style={{ width: '1em', height: '1em', flexShrink: 0 }} strokeWidth={1.5} />
            From Designers to Designers
          </p>

          {/* CTA */}
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Button
              href="https://docs.google.com/forms/d/e/1FAIpQLSdabviunpmu-iYQ1w-y9kKKHQeqeAGuyhkAERoc47jgvxn-zw/viewform?usp=preview" target='blank'
              variant="underline"
              className="text-[20px] md:text-[32px] text-dojo-white border-accent border-b-2 hover:text-accent"
            >
              Me Interesa
              <IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Photo */}
        <motion.div
          className="w-full max-h-[60vh] lg:max-h-none lg:w-[615px] lg:shrink-0 overflow-hidden rounded-3xl relative"
          style={{ aspectRatio: '615/917' }}
          initial={{ opacity: 0, x: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <Image
            src="/images/mentorships-ramses.jpg"
            alt="Mentorías"
            fill
            className="object-cover object-center"
          />
        </motion.div>
      </div>
    </section>
  )
}
