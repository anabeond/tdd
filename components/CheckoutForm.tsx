'use client'

import { useState } from 'react'
import Image from 'next/image'

type CheckoutFormProps = {
  productSlug: string
  productTitle: string
  price: number
  thinkificUrl: string
}

type Status = 'idle' | 'loading' | 'error'

export default function CheckoutForm({ productSlug, productTitle, price, thinkificUrl }: CheckoutFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleArgentina() {
    if (!name.trim() || !email.trim()) {
      setError('Completá tu nombre y email para continuar.')
      return
    }
    setStatus('loading')
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug, name: name.trim(), email: email.trim() }),
      })
      const data = await res.json() as { init_point?: string; error?: string }
      if (!res.ok || !data.init_point) {
        setError(data.error ?? 'Error al procesar el pago. Intentá de nuevo.')
        setStatus('error')
        return
      }
      window.location.href = data.init_point
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  async function handleOutsideArgentina() {
    if (!name.trim() || !email.trim()) {
      setError('Completá tu nombre y email para continuar.')
      return
    }
    setError(null)
    // Fire-and-forget: save the buyer record, then redirect regardless
    fetch('/api/checkout/external', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productSlug, name: name.trim(), email: email.trim() }),
    }).catch(() => {})
    window.open(thinkificUrl, '_blank', 'noopener,noreferrer')
  }

  const loading = status === 'loading'

  return (
    <div className="flex flex-col gap-10">
      {/* Product summary */}
      <div className="flex flex-col gap-2 border-b border-dojo-white/15 pb-8">
        <p className="text-dojo-white/60 text-[13px] uppercase tracking-[0.08em]">Comprando</p>
        <h2
          className="font-semibold text-dojo-white"
          style={{ fontSize: 'clamp(24px, 3vw, 40px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          {productTitle}
        </h2>
        <p className="text-dojo-white/70 text-[18px] font-medium mt-1">
          USD {price.toLocaleString('en-US')}
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-6">
        <p className="text-dojo-white/80 text-[16px]">
          Ingresá tus datos para continuar con la compra.
          Deben ser los mismos que quieras usar para acceder a la plataforma.
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-dojo-white/60 text-[12px] uppercase tracking-[1.4px]">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="Tu nombre completo"
              className="bg-transparent border border-dojo-white/20 text-dojo-white placeholder:text-dojo-white/30 px-4 py-3 text-[16px] outline-none focus:border-dojo-white/60 transition-colors disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-dojo-white/60 text-[12px] uppercase tracking-[1.4px]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="tu@email.com"
              className="bg-transparent border border-dojo-white/20 text-dojo-white placeholder:text-dojo-white/30 px-4 py-3 text-[16px] outline-none focus:border-dojo-white/60 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {error && (
          <p className="text-accent text-[14px]">{error}</p>
        )}
      </div>

      {/* Payment options */}
      <div className="flex flex-col gap-4">
        <p className="text-dojo-white/60 text-[13px] uppercase tracking-[0.08em]">¿Desde dónde comprás?</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleArgentina}
            disabled={loading}
            className="w-full border border-dojo-white text-dojo-white px-6 py-4 text-[16px] font-semibold text-left flex items-center justify-between transition-colors hover:bg-dojo-white hover:text-dark-blue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Soy de Argentina</span>
            <span className="text-[13px] font-normal opacity-70">→ Mercado Pago</span>
          </button>
          <button
            onClick={handleOutsideArgentina}
            disabled={loading}
            className="w-full border border-dojo-white/30 text-dojo-white/70 px-6 py-4 text-[16px] font-semibold text-left flex items-center justify-between transition-colors hover:border-dojo-white/60 hover:text-dojo-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Estoy fuera de Argentina</span>
            <span className="text-[13px] font-normal opacity-70">→ Paypal</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 bg-white p-4 w-full">
          <Image src="/images/mercadopago.png" alt="Mercado Pago" height={32} width={160} className="object-contain" />
          <Image src="/images/paypal.png" alt="PayPal" height={32} width={100} className="object-contain" />
          <Image src="/images/thinkific.png" alt="Thinkific" height={32} width={120} className="object-contain" />
        </div>

        <p className="text-dojo-white/40 text-[12px]">
          Podés pagar en Argentina, en cuotas.
        </p>
        <p className="text-dojo-white/40 text-[12px]">
          Todos los precios están en USD, pero en Mercado Pago lo verás reflejado en pesos.
        </p>
      </div>
    </div>
  )
}
