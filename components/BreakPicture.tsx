'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

interface BreakPictureProps {
  src?: string
  height?: number
}

export default function BreakPicture({ src = '/images/break-picture.png', height = 800 }: BreakPictureProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])

  return (
    <section ref={ref} className="relative w-full overflow-hidden" style={{ height }}>
      <motion.div className="absolute inset-[-20%] top-0 bottom-0" style={{ y }}>
        <Image src={src} alt="" fill className="object-cover object-center" />
      </motion.div>
      <div className="absolute inset-0 bg-black/80 mix-blend-color" />
      <div className="absolute inset-0 bg-black/50 mix-blend-soft-light" />
    </section>
  )
}
