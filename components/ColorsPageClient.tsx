'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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

function formatCount(n: number): string {
  return n.toLocaleString('es-AR')
}

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
  const [showStats, setShowStats] = useState(true)

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
    const total = tally.totalSubmissions
    const ranked = [...COLOR_PALETTE].sort((a, b) => percentages[b.key] - percentages[a.key])

    return (
      <main className="fixed inset-0 overflow-hidden">
        <PixelCanvas percentages={percentages} />

        <AnimatePresence mode="wait">
          {showStats ? (
            <motion.div
              key="panel"
              className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
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
                  <p className="font-light text-white/50" style={{ fontSize: 14 }}>
                    {result.alreadySubmitted ? 'ya habías elegido' : 'tu color'}
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

                <div className="flex items-end justify-between gap-4">
                  <p className="font-light text-white/50" style={{ fontSize: 14 }}>
                    {total === 1
                      ? '1 persona pintó el mural'
                      : `${formatCount(total)} personas pintaron el mural`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowStats(false)}
                    className="font-medium text-white border-b border-white/40 hover:border-white transition-colors cursor-pointer shrink-0"
                    style={{ fontSize: 13 }}
                  >
                    ver el mural
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="reopen"
              type="button"
              onClick={() => setShowStats(true)}
              className="absolute bottom-4 right-4 bg-black text-white font-medium px-4 py-2 cursor-pointer"
              style={{ fontSize: 13 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              ver los datos
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    )
  }

  return (
    <main className="bg-white min-h-screen px-4 md:px-page py-16 flex items-start justify-start">
      <motion.div
        className="max-w-[474px] w-full flex flex-col gap-16 md:gap-32"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col gap-8">
          {/* Badge */}
          <div className="bg-black inline-flex items-center justify-center px-4 py-1 self-start">
            <p
              className="font-medium text-white whitespace-nowrap"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)', letterSpacing: '-0.02em' }}
            >
              /colors
            </p>
          </div>

          {/* Invitation — the mural is open to anyone, not only students. */}
          <div className="flex flex-col gap-2">
            <p
              className="font-medium text-black"
              style={{ fontSize: 'clamp(16px, 2vw, 24px)', lineHeight: 1.25 }}
            >
              Un mural colectivo hecho de píxeles. Elegí tu color favorito y sumá el tuyo.
            </p>
            {tally.totalSubmissions > 0 && (
              <motion.p
                className="font-light text-black/50"
                style={{ fontSize: 14 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {tally.totalSubmissions === 1
                  ? '1 persona ya sumó su píxel'
                  : `${formatCount(tally.totalSubmissions)} personas ya sumaron su píxel`}
              </motion.p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
                style={{ fontSize: 'clamp(24px, 3.4vw, 32px)', letterSpacing: '-0.02em' }}
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
                style={{ fontSize: 'clamp(24px, 3.4vw, 32px)', letterSpacing: '-0.02em' }}
              />
              <div className="bg-black h-1 w-full" />
            </div>

            {/* Color swatches */}
            <div className="flex flex-col gap-2">
              <p
                className="font-medium text-black"
                style={{ fontSize: 'clamp(24px, 3.4vw, 32px)', letterSpacing: '-0.02em' }}
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
          <p
            className="font-medium text-black"
            style={{ fontSize: 'clamp(16px, 2vw, 24px)', lineHeight: 1.25 }}
          >
            *un píxel por email. Lo usamos solo para eso.
          </p>
        </div>

        {/* Logo mark — white-fill asset, forced black on this light page */}
        <img
          src="/images/logo-footer.svg"
          alt=""
          className="size-16"
          style={{ filter: 'brightness(0) saturate(100%)' }}
        />
      </motion.div>
    </main>
  )
}
