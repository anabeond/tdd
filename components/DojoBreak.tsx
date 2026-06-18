'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function DojoBreak() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-120px', '120px'])

  return (
    <section
      ref={ref}
      className="w-full bg-accent overflow-hidden flex items-center justify-center"
      style={{ height: 320 }}
    >
      <motion.div
        style={{ y, width: 1741, height: 600, flexShrink: 0 }}
      >
        <img
          src="https://www.figma.com/api/mcp/asset/fe2475bd-46ab-451c-a881-a321a148f74b"
          alt="design dojo"
          width={1741}
          height={600}
          style={{ display: 'block', width: '100%', height: '100%' }}
          draggable={false}
        />
      </motion.div>
    </section>
  )
}
