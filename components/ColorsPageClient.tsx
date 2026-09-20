'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { IconArrowRight, IconCheck } from '@tabler/icons-react'
import { COLOR_PALETTE, getColorHex, getColorLabel, type ColorKey } from '@/lib/colors'
import PixelCanvas from '@/components/PixelCanvas'
import type { ColorTally } from '@/lib/color-votes'

type Status = 'idle' | 'loading' | 'error' | 'result'

type ColorsResponse = ColorTally & {
  ok: boolean
  yourColor: ColorKey
  alreadySubmitted: boolean
}

const LIVE_REFRESH_MS = 20000

function formatPercent(value: number): string {
  if (value > 0 && value < 1) return '<1%'
  return `${Math.round(value)}%`
}

export default function ColorsPageClient({ initialTally }: { initialTally: ColorTally }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [color, setColor] = useState<ColorKey | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [result, setResult] = useState<ColorsResponse | null>(null)
  const [tally, setTally] = useState<ColorTally>(initialTally)

  const fetchTally = useCallback(async () => {
    try {
      const res = await fetch('/api/colors')
      if (!res.ok) return
      const data = (await res.json()) as ColorTally
      setTally((prev) =>
        prev.totalSubmissions === data.totalSubmissions
          ? prev
          : { totalSubmissions: data.totalSubmissions, percentages: data.percentages }
      )
    } catch {
      // The mural just keeps the numbers it already has.
    }
  }, [])

  // Slow poll so the count on the form and the mural itself keep breathing for
  // anyone who leaves the page open.
  useEffect(() => {
    const timer = setInterval(fetchTally, LIVE_REFRESH_MS)
    return () => clearInterval(timer)
  }, [fetchTally])

  // Identity is stable between polls that change nothing, so PixelCanvas only
  // repaints when the numbers actually move.
  const percentages = tally.percentages

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (status === 'loading' || !color) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, color }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Error al enviar. Intentá de nuevo.')
        setStatus('error')
        return
      }

      setResult(data)
      setTally({ totalSubmissions: data.totalSubmissions, percentages: data.percentages })
      setStatus('result')
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'result' && result) {
    const ranked = [...COLOR_PALETTE].sort((a, b) => percentages[b.key] - percentages[a.key])

    return (
      <main className="fixed inset-0 overflow-hidden">
        <PixelCanvas percentages={percentages} />

        <motion.div
          className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-black w-full max-w-[440px] flex flex-col gap-8 p-6 my-auto">
            {/* Lockup */}
            <div className="inline-flex items-center gap-4">
              <img src="/images/logo-footer.svg" alt="" className="size-12 shrink-0" />
              <p
                className="font-medium text-white whitespace-nowrap"
                style={{ fontSize: 'clamp(32px, 6vw, 48px)', letterSpacing: '-0.02em' }}
              >
                /colors
              </p>
            </div>
            {/* Your color */}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-white" style={{ fontSize: 14 }}>
                Tu Color
              </p>
              <div className="flex items-center gap-3">
                <span
                  className="size-8 shrink-0"
                  style={{ backgroundColor: getColorHex(result.yourColor) }}
                />
                <p
                  className="font-medium text-white"
                  style={{ fontSize: 'clamp(20px, 4vw, 28px)', letterSpacing: '-0.02em' }}
                >
                  {getColorLabel(result.yourColor)}
                </p>
              </div>
            </div>
            {/* Live breakdown */}
            <div className="flex flex-col gap-4">
              <div className="flex h-3 w-full overflow-hidden">
                {ranked.map((c) => (
                  <div
                    key={c.key}
                    className="h-full transition-[width] duration-700 ease-out"
                    style={{ width: `${percentages[c.key]}%`, backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {ranked.map((c) => (
                  <li key={c.key} className="flex items-center gap-2 min-w-0">
                    <span className="size-3 shrink-0" style={{ backgroundColor: c.hex }} />
                    <span
                      className={`font-light truncate ${
                        c.key === result.yourColor ? 'text-white' : 'text-white/50'
                      }`}
                      style={{ fontSize: 13 }}
                    >
                      {c.label}
                    </span>
                    <span className="font-medium text-white ml-auto shrink-0" style={{ fontSize: 13 }}>
                      {formatPercent(percentages[c.key])}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    // min-height + flex-1 rather than a percentage height: iOS Safari leaves `h-full`
    // unresolved here, which collapsed the column and stacked everything at the top.
    // Growing past the viewport (a phone in landscape) scrolls instead of clipping.
    <main className="bg-white min-h-[100svh] px-4 md:px-page py-[clamp(16px,4vh,40px)] flex flex-col">
      <div className="max-w-[474px] w-full flex-1 flex flex-col gap-[clamp(16px,3vh,32px)]">
        <div className="flex flex-col flex-1 justify-between gap-[clamp(16px,3vh,32px)]">
          {/* Badge */}
          <div className="bg-black inline-flex items-center justify-center px-4 py-1 self-start">
            <p
              className="font-medium text-white whitespace-nowrap"
              style={{ fontSize: 'clamp(28px, min(5vw, 6.5vh), 64px)', letterSpacing: '-0.02em' }}
            >
              /colors
            </p>
          </div>

          {/* Invitation — the mural is open to anyone, not only students. */}
          <p
            className="font-medium text-black"
            style={{ fontSize: 'clamp(15px, min(2vw, 2.4vh), 24px)', lineHeight: 1.3 }}
          >
            Colors es un mural dinámico donde podés sumar tu color favorito y ver el % de personas a las que también les gusta ese color.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(16px,3vh,32px)]">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <input
                id="name"
                type="text"
                placeholder="nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={status === 'loading'}
                className="bg-transparent outline-none font-medium text-black placeholder:text-black w-full disabled:opacity-50"
                style={{ fontSize: 'clamp(20px, min(3.4vw, 3.8vh), 32px)', letterSpacing: '-0.02em' }}
              />
              <div className="bg-black h-1 w-full" />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <input
                id="email"
                type="email"
                placeholder="email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="bg-transparent outline-none font-medium text-black placeholder:text-black w-full disabled:opacity-50"
                style={{ fontSize: 'clamp(20px, min(3.4vw, 3.8vh), 32px)', letterSpacing: '-0.02em' }}
              />
              <div className="bg-black h-1 w-full" />
            </div>

            {/* Color swatches */}
            <div className="flex flex-col gap-2">
              <p
                className="font-medium text-black"
                style={{ fontSize: 'clamp(20px, min(3.4vw, 3.8vh), 32px)', letterSpacing: '-0.02em' }}
              >
                tu color favorito
              </p>
              <div className="flex flex-wrap">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    aria-label={c.label}
                    aria-pressed={color === c.key}
                    disabled={status === 'loading'}
                    onClick={() => setColor(c.key)}
                    className="relative size-8 shrink-0 disabled:opacity-50 cursor-pointer"
                    style={{ backgroundColor: c.hex }}
                  >
                    {color === c.key && (
                      <IconCheck size={18} strokeWidth={3} className="absolute inset-0 m-auto text-black" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="underline"
                className="text-[20px] md:text-[28px] text-black border-black hover:text-accent hover:border-accent disabled:opacity-50"
                disabled={status === 'loading' || !color}
              >
                {status === 'loading' ? 'Enviando...' : 'COLORS!'}
                <IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
              </Button>
            </div>

            {status === 'error' && (
              <p className="font-light text-accent" style={{ fontSize: 14 }}>
                {errorMsg}
              </p>
            )}
          </form>

          {/* Disclaimer */}
          <p className="font-medium text-black" style={{ fontSize: 13, lineHeight: 1.4 }}>
            *Sumá un color por mail. Al hacerlo, te estarás registrando en nuestra lista de mails del Dojo.
          </p>
        </div>

        {/* Logo mark — white-fill asset, forced black on this light page */}
        <img
          src="/images/logo-footer.svg"
          alt=""
          className="size-12 md:size-16 shrink-0"
          style={{ filter: 'brightness(0) saturate(100%)' }}
        />
      </div>
    </main>
  )
}
