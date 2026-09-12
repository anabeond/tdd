'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { IconArrowRight } from '@tabler/icons-react'
import type { ComingSoonData } from '@/lib/products'

export type { ComingSoonData }

type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

export default function ComingSoonTemplate({ product }: { product: ComingSoonData }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, productSlug: product.slug }),
      })
      const data = await res.json()

      if (res.status === 409) { setStatus('duplicate'); return }
      if (!res.ok) { setErrorMsg(data.error ?? 'Error. Intentá de nuevo.'); setStatus('error'); return }
      setStatus('success')
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  return (
    <section className="w-full bg-dark-blue text-dojo-white px-page pt-40 pb-32">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-start"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Left — product info */}
        <div className="flex flex-col gap-8">
          <p
            className="font-semibold text-dojo-white/40 uppercase"
            style={{ fontSize: 13, letterSpacing: '0.1em' }}
          >
            /{product.badge}
          </p>

          <div className="flex flex-col gap-4">
            <h1
              className="font-semibold"
              style={{ fontSize: 'clamp(40px, 5.5vw, 88px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}
            >
              {product.title}
            </h1>
            {product.subtitle && (
              <p
                className="font-light text-dojo-white/70"
                style={{ fontSize: 'clamp(20px, 1.8vw, 28px)', letterSpacing: '-0.02em', lineHeight: 1.25 }}
              >
                {product.subtitle}
              </p>
            )}
          </div>

          {product.description && (
            <p
              className="font-light text-dojo-white/55 leading-relaxed"
              style={{ fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.65 }}
            >
              {product.description}
            </p>
          )}
        </div>

        {/* Right — form */}
        <div className="flex flex-col gap-8 lg:pt-[calc(13px+1.5em+0.5rem)]">
          {/* "Próximamente" label */}
          <div className="flex flex-col gap-1">
            <p
              className="font-semibold text-dojo-white"
              style={{ fontSize: 'clamp(22px, 1.8vw, 30px)', letterSpacing: '-0.02em' }}
            >
              Próximamente
            </p>
            <p className="font-light text-dojo-white/40" style={{ fontSize: 15, lineHeight: 1.5 }}>
              Anotate y te avisamos cuando esté disponible.
            </p>
          </div>

          <div className="h-px bg-dojo-white/10" />

          {status === 'success' ? (
            <motion.p
              className="font-light text-dojo-white"
              style={{ fontSize: 'clamp(18px, 1.4vw, 22px)', letterSpacing: '-0.02em', lineHeight: 1.4 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              ¡Listo! Te avisamos cuando esté disponible.
            </motion.p>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="flex flex-col-reverse gap-2 border-b-2 border-dojo-white/20 pb-1 pt-3 focus-within:border-dojo-white/60 transition-colors duration-300">
                <input
                  id="cs-name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={status === 'loading'}
                  className="peer bg-transparent outline-none font-light text-dojo-white placeholder:text-dojo-white/20 w-full disabled:opacity-50"
                  style={{ fontSize: 22, letterSpacing: '-0.02em', lineHeight: 1.2 }}
                />
                <label
                  htmlFor="cs-name"
                  className="font-medium text-dojo-white/40 uppercase tracking-widest opacity-0 transition-opacity duration-200 peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100"
                  style={{ fontSize: 11 }}
                >
                  Nombre
                </label>
              </div>

              {/* Email */}
              <div className="flex flex-col-reverse gap-2 border-b-2 border-dojo-white/20 pb-1 pt-3 focus-within:border-dojo-white/60 transition-colors duration-300">
                <input
                  id="cs-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                  className="peer bg-transparent outline-none font-light text-dojo-white placeholder:text-dojo-white/20 w-full disabled:opacity-50"
                  style={{ fontSize: 22, letterSpacing: '-0.02em', lineHeight: 1.2 }}
                />
                <label
                  htmlFor="cs-email"
                  className="font-medium text-dojo-white/40 uppercase tracking-widest opacity-0 transition-opacity duration-200 peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100"
                  style={{ fontSize: 11 }}
                >
                  Email
                </label>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <Button
                  type="submit"
                  variant="underline"
                  className="text-[22px] text-dojo-white border-accent border-b-2 hover:text-accent whitespace-nowrap disabled:opacity-50"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Enviando...' : 'Me Interesa'}
                  <IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
                </Button>
              </div>

              {status === 'duplicate' && (
                <p className="font-light text-dojo-white/50" style={{ fontSize: 13 }}>
                  Ya estás anotado con ese email.
                </p>
              )}
              {status === 'error' && (
                <p className="font-light text-accent" style={{ fontSize: 13 }}>
                  {errorMsg}
                </p>
              )}
            </form>
          )}
        </div>
      </motion.div>

      {product.thumbnail && (
        <motion.div
          className="relative w-full overflow-hidden md:hidden"
          style={{ aspectRatio: '1320 / 1832', marginTop: '4em' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={product.thumbnail} alt={product.title} className="w-full h-full object-contain" />
        </motion.div>
      )}

      {product.featuredImage && (
        <motion.div
          className={`relative w-full overflow-hidden ${product.thumbnail ? 'hidden md:block' : 'block'}`}
          style={{ aspectRatio: '1920 / 768', marginTop: '4em' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={product.featuredImage} alt={product.title} className="w-full h-full object-contain" />
        </motion.div>
      )}
    </section>
  )
}
