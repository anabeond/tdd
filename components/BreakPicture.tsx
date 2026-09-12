'use client'

import { useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

interface BreakPictureProps {
  src?: string
  srcMobile?: string
  height?: number
  fit?: 'cover' | 'contain'
  overlay?: boolean
  children?: ReactNode
}

export default function BreakPicture({
  src = '/images/break-picture.png',
  srcMobile,
  height = 800,
  fit = 'cover',
  overlay = true,
  children,
}: BreakPictureProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])
  const imageClassName = fit === 'contain' ? 'object-contain object-center' : 'object-cover object-center'

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden flex flex-col justify-center"
      style={{ minHeight: height }}
    >
      <motion.div className="absolute inset-[-20%] top-0 bottom-0" style={{ y }}>
        {srcMobile && srcMobile !== src ? (
          <>
            <Image src={srcMobile} alt="" fill className={`md:hidden ${imageClassName}`} />
            <Image src={src} alt="" fill className={`hidden md:block ${imageClassName}`} />
          </>
        ) : (
          <Image src={src} alt="" fill className={imageClassName} />
        )}
      </motion.div>
      {overlay && (
        <>
          <div className="absolute inset-0 bg-black/80 mix-blend-color" />
          <div className="absolute inset-0 bg-black/50 mix-blend-soft-light" />
        </>
      )}
      {children && (
        <div className="relative z-20 flex flex-col gap-8 px-4 md:px-page py-16">
          {children}
        </div>
      )}
    </section>
  )
}
