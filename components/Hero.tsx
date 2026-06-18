'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
// import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Parallax: text moves up slowly as user scrolls down
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const text = "Do it for Design."
  const letters = text.split('')
  const [blurValues, setBlurValues] = useState(new Array(letters.length).fill(0))
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  const handleMouseMove = (e: React.MouseEvent) => {
    const mouseX = e.clientX
    const mouseY = e.clientY
    const newBlur = letters.map((_, i) => {
      const el = refs.current[i]
      if (el) {
        const letterRect = el.getBoundingClientRect()
        const centerX = letterRect.left + letterRect.width / 2
        const centerY = letterRect.top + letterRect.height / 2
        const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2)
        return distance < 100 ? 8 : 0
      }
      return 0
    })
    setBlurValues(newBlur)
  }

  return (
    <section
      ref={ref}
      className="relative w-full bg-dark-blue overflow-hidden flex items-center justify-center"
      style={{ height: '100svh' }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* Hero text */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-6"
        style={{ y, opacity }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        {/* <ThemeToggle /> */}
        <motion.h1
          className="font-medium whitespace-nowrap select-none text-dojo-white"
          style={{
            fontSize: 'clamp(40px, 15vw, 320px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
          onMouseMove={handleMouseMove}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              ref={(el) => { refs.current[i] = el }}
              animate={{
                filter: `blur(${blurValues[i]}px)`,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </motion.div>

    </section>
  )
}
