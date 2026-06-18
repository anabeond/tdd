'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AnnouncementBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.a
      href="/programs/fundamentals-ux-ui"
      className="fixed top-0 left-0 right-0 z-[60] bg-white flex items-center justify-center px-6 py-2 overflow-hidden cursor-pointer hover:bg-neutral-100 transition-colors duration-200"
      animate={{ y: scrolled ? '-100%' : 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="font-semibold text-black text-[14px] text-center leading-snug">
        Programa Fundamentos de Diseño UX/UI - Comenzamos el 27 de Abril, Día del Diseño
      </p>
    </motion.a>
  )
}
