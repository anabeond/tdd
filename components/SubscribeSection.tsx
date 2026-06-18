'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { IconArrowRight } from '@tabler/icons-react'

type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

export default function SubscribeSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })

      const data = await res.json()

      if (res.status === 409) {
        setStatus('duplicate')
        return
      }
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Error al suscribir. Intentá de nuevo.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  return (
    <section id="subscribe" className="w-full px-4 md:px-page">
      <motion.div
        className="max-w-[1856px] mx-auto flex flex-col gap-4 py-16 md:py-32"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Headline */}
        <h2
          className="font-medium text-dojo-white"
          style={{
            fontSize: 'clamp(36px, 3.33vw, 64px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          Recibí contenidos especiales
        </h2>

        {/* Subtitle */}
        <p
          className="font-light text-dojo-white/50"
          style={{ fontSize: 'clamp(28px, 2.5vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
        >
          Acceso anticipado y algunas sorpresas en el camino.
        </p>

        {status === 'success' ? (
          <motion.p
            className="font-light text-dojo-white mt-4"
            style={{ fontSize: 'clamp(20px, 1.8vw, 32px)', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            ¡Listo! Ya estás en la lista. 🎉
          </motion.p>
        ) : (
          <>
            {/* Form */}
            <form className="flex flex-col gap-8 md:flex-row md:items-end md:gap-12 w-full mt-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="flex flex-col-reverse gap-2 border-b-2 border-dojo-white/20 pb-1 pt-4 flex-1 focus-within:border-dojo-white/60 transition-colors duration-300">
                <input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={status === 'loading'}
                  className="peer bg-transparent outline-none font-light text-dojo-white placeholder:text-dojo-white/20 w-full disabled:opacity-50"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
                />
                <label
                  htmlFor="name"
                  className="font-medium text-dojo-white/40 uppercase tracking-widest opacity-0 transition-opacity duration-200 peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100"
                  style={{ fontSize: 11 }}
                >
                  Nombre
                </label>
              </div>

              {/* Email */}
              <div className="flex flex-col-reverse gap-2 border-b-2 border-dojo-white/20 pb-1 pt-4 flex-1 focus-within:border-dojo-white/60 transition-colors duration-300">
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                  className="peer bg-transparent outline-none font-light text-dojo-white placeholder:text-dojo-white/20 w-full disabled:opacity-50"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
                />
                <label
                  htmlFor="email"
                  className="font-medium text-dojo-white/40 uppercase tracking-widest opacity-0 transition-opacity duration-200 peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100"
                  style={{ fontSize: 11 }}
                >
                  Email
                </label>
              </div>

              {/* Submit */}
              <div className="shrink-0">
                <Button
                  type="submit"
                  variant="underline"
                  className="text-[20px] md:text-[32px] text-dojo-white border-accent border-b-2 hover:text-accent whitespace-nowrap disabled:opacity-50"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
                  <IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
                </Button>
              </div>
            </form>

            {/* Feedback messages */}
            {status === 'duplicate' && (
              <p className="font-light text-dojo-white/60 mt-1" style={{ fontSize: 14 }}>
                Ya estás suscripto con ese email.
              </p>
            )}
            {status === 'error' && (
              <p className="font-light text-accent mt-1" style={{ fontSize: 14 }}>
                {errorMsg}
              </p>
            )}
          </>
        )}
      </motion.div>
    </section>
  )
}
