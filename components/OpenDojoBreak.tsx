'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function OpenDojoBreak() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden h-[90vh] md:h-[640px]"
    >
      <motion.div className="absolute inset-[-20%] top-0 bottom-0" style={{ y }}>
        <Image
          src="/images/design-dojo-banner-live-stream.png"
          alt=""
          fill
          className="object-cover object-center md:hidden"
        />
        <Image
          src="/images/open%20dojo.png"
          alt=""
          fill
          className="hidden md:block object-cover object-center"
        />
      </motion.div>
    </section>
  )
}
