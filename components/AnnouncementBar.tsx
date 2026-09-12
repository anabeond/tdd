'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AnnouncementBar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathname?.startsWith('/colors')) return null

  return (
    <motion.a
      href="/programs/fundamentals-ux-ui"
      className="fixed top-0 left-0 right-0 z-[60] bg-white flex items-center justify-center px-6 py-2 overflow-hidden cursor-pointer hover:bg-neutral-100 transition-colors duration-200"
      animate={{ y: scrolled ? '-100%' : 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="font-semibold text-black text-[14px] text-center leading-snug">
        Feliz Primavera 2026 🌻🌞 Usa 'OPEN-DOJO' para 50% Off en Fundamentos de UX/UI
      </p>
    </motion.a>
  )
}
