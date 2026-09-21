'use client'

import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { IconArrowRight } from '@tabler/icons-react'

type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

type InterestFormProps = {
  productSlug: string
  submitLabel?: string
  successMessage?: string
}

/**
 * Nombre + mail → /api/interest (Supabase + Brevo).
 * Se usa en la página de Próximamente y en el cuadro de CTA de un programa en pre_launch,
 * donde puede haber más de una instancia en la misma página: los ids salen de useId.
 */
export default function InterestForm({
  productSlug,
  submitLabel = 'Me Interesa',
  successMessage = '¡Listo! Te avisamos apenas abra.',
}: InterestFormProps) {
  const uid = useId()
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
        body: JSON.stringify({ name, email, productSlug }),
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

  if (status === 'success') {
    return (
      <motion.p
        className="font-light text-dojo-white"
        style={{ fontSize: 'clamp(18px, 1.4vw, 22px)', letterSpacing: '-0.02em', lineHeight: 1.4 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {successMessage}
      </motion.p>
    )
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Nombre */}
      <div className="flex flex-col-reverse gap-2 border-b-2 border-dojo-white/20 pb-1 pt-3 focus-within:border-dojo-white/60 transition-colors duration-300">
        <input
          id={`${uid}-name`}
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
          htmlFor={`${uid}-name`}
          className="font-medium text-dojo-white/40 uppercase tracking-widest opacity-0 transition-opacity duration-200 peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100"
          style={{ fontSize: 11 }}
        >
          Nombre
        </label>
      </div>

      {/* Email */}
      <div className="flex flex-col-reverse gap-2 border-b-2 border-dojo-white/20 pb-1 pt-3 focus-within:border-dojo-white/60 transition-colors duration-300">
        <input
          id={`${uid}-email`}
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
          htmlFor={`${uid}-email`}
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
          {status === 'loading' ? 'Enviando...' : submitLabel}
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
  )
}
