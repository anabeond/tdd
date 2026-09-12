'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { IconBrandTwitch, IconArrowRight, IconPlayerPlayFilled } from '@tabler/icons-react'

interface TwitchStatus {
  live: boolean
  viewerCount?: number
  title?: string
  videoId?: string | null
}

interface VideoMeta {
  youtubeId: string
  title: string
  publishedAt: string
}

function getNextMondayLabel(): string {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 1=Mon, 2=Tue, ...6=Sat

  if (day === 1) return 'Hoy'
  if (day === 0) return 'Mañana'

  const daysUntilMonday = (1 - day + 7) % 7
  const next = new Date(now)
  next.setDate(now.getDate() + daysUntilMonday)

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ]
  return `${next.getDate()} ${months[next.getMonth()]}`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]}`
}

const VIDEO_CARDS = [
  { id: 1, color: '#f97353', youtubeId: '7flTLfhR1nc' },
  { id: 2, color: '#fb9b84', youtubeId: 'Vh8LkY2jM-0' },
  { id: 3, color: '#f74c22', youtubeId: 'YclMJ59ibJ8' },
  { id: 4, color: '#f97353', youtubeId: 'veGDEEm9Kr4' },
]

export default function LivestreamsSection() {
  const [twitch, setTwitch] = useState<TwitchStatus>({ live: false })
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [videoMeta, setVideoMeta] = useState<Record<string, VideoMeta>>({})

  useEffect(() => {
    fetch('/api/twitch/status')
      .then((r) => r.json())
      .then((data: TwitchStatus) => setTwitch(data))
      .catch(() => {/* fail silently */})
  }, [])

  useEffect(() => {
    const ids = VIDEO_CARDS.map((c) => c.youtubeId).join(',')
    fetch(`/api/youtube/videos?ids=${ids}`)
      .then((r) => r.json())
      .then((data: VideoMeta[]) => {
        const map: Record<string, VideoMeta> = {}
        data.forEach((v) => { map[v.youtubeId] = v })
        setVideoMeta(map)
      })
      .catch(() => {/* fail silently */})
  }, [])

  return (
    <section className="w-full flex flex-col gap-16 md:gap-32 lg:gap-48">
      {/* Header block */}
      <div className="flex flex-col gap-16 items-center">
        {/* Band image — decorative; full vertical poster on mobile, thin band on desktop */}
        <div className="w-full overflow-hidden relative aspect-[1320/1832] md:aspect-auto md:h-16">
          <Image
            src="/images/design-dojo-banner-doitfordesign01.png"
            alt=""
            fill
            className="object-contain opacity-80 md:hidden"
          />
          <Image
            src="/images/dojo-bio.png"
            alt=""
            fill
            className="hidden md:block object-cover object-center opacity-80"
          />
        </div>

        {/* Headline */}
        <motion.div
          className="px-4 md:px-page w-full max-w-[1856px] mx-auto flex flex-col gap-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <IconBrandTwitch size={64} className="text-dojo-white" strokeWidth={1.5} />
          <h2
            className="text-dojo-white font-semibold"
            style={{
              fontSize: 'clamp(20px, 5.5vw, 84px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            <span className="block font-light uppercase tracking-widest text-accent mb-4" style={{ fontSize: 16, letterSpacing: '0.12em' }}>#MondayUXNight</span>
            Todos los Lunes diseñamos en vivo con vos.{' '}
            <span className="font-light inline-flex items-center gap-2 whitespace-nowrap"><IconArrowRight className="inline-block shrink-0" style={{ width: '0.9em', height: '0.9em' }} strokeWidth={1.5} />Siempre por{' '}<a href="https://www.twitch.tv/thedesigndojo" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-accent">Twitch.</a></span>
          </h2>
        </motion.div>
      </div>

      {/* Next stream info */}
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-center md:gap-8 px-4 md:px-page max-w-[1856px] mx-auto w-full">
        {/* Twitch embed */}
        <div className="shrink-0 flex flex-col gap-2">
          <motion.div
            className="w-full md:w-[620px] aspect-video rounded-2xl overflow-hidden relative bg-white/10"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {twitch.videoId && (
              <iframe
                src={`https://player.twitch.tv/?video=${twitch.videoId}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=false`}
                className="w-full h-full"
                allowFullScreen
              />
            )}
          </motion.div>
          <p className="text-[14px] text-dojo-white/40">
            Este fue el último stream,{' '}
            <a
              href="https://www.twitch.tv/thedesigndojo"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-dojo-white/70 transition-colors duration-200"
            >
              miralo en Twitch.
            </a>
          </p>
        </div>
        <motion.div
          className="flex flex-col gap-8"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            {twitch.live ? (
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-500 animate-pulse" />
                <p
                  className="font-semibold text-red-400"
                  style={{ fontSize: 'clamp(28px, 2.08vw, 40px)', letterSpacing: '-0.8px', lineHeight: 1.2 }}
                >
                  En vivo ahora
                </p>
              </div>
            ) : (
              <p
                className="font-semibold text-dojo-white"
                style={{ fontSize: 'clamp(28px, 2.08vw, 40px)', letterSpacing: '-0.8px', lineHeight: 1.2 }}
              >
                Próximo Stream
              </p>
            )}
            <p
              className="font-light text-dojo-white flex items-center gap-2"
              style={{ fontSize: 'clamp(28px, 2.08vw, 40px)', letterSpacing: '-0.8px' }}
            >
              <IconArrowRight className="shrink-0" style={{ width: '0.9em', height: '0.9em' }} strokeWidth={1.5} />
              {twitch.live ? twitch.title : getNextMondayLabel()}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Video cards + label — hidden until this stage is activated, kept in place for later */}
      <div className="hidden flex-col gap-8" aria-hidden="true">
        <p
          className="px-4 md:px-page font-medium text-dojo-white/50"
          style={{ fontSize: 16, letterSpacing: '-0.02em' }}
        >
          Miralos grabados en YouTube
        </p>

        {/* Video cards */}
        <div className="flex items-start gap-0 px-4 md:px-page overflow-x-auto pb-4 max-w-full" style={{ scrollbarWidth: 'none' }}>
        {VIDEO_CARDS.map((card, i) => {
          const meta = videoMeta[card.youtubeId]
          return (
            <motion.div
              key={card.id}
              className="flex flex-col gap-8 shrink-0 w-[85vw] sm:w-[464px] cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            >
              {/* Thumbnail / Embed */}
              <div
                className="h-[260px] w-full overflow-hidden relative cursor-pointer"
                style={{ backgroundColor: card.color }}
                onClick={() => setPlayingId(card.id)}
              >
                {playingId === card.id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${card.youtubeId}?autoplay=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={`https://img.youtube.com/vi/${card.youtubeId}/maxresdefault.jpg`}
                        alt={meta?.title ?? ''}
                        fill
                        className="object-cover"
                        sizes="464px"
                      />
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-14 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <IconPlayerPlayFilled className="text-white size-6 ml-0.5" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-4">
                <p
                  className="font-semibold text-dojo-white"
                  style={{ fontSize: 'clamp(18px, 4vw, 28px)', letterSpacing: '-0.56px', lineHeight: 1.2 }}
                >
                  {meta?.title ?? ''}
                </p>
                {meta?.publishedAt && (
                  <span
                    className="font-semibold text-[16px] text-dojo-white"
                    style={{ letterSpacing: '-0.32px' }}
                  >
                    {formatDate(meta.publishedAt)}
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
        </div>
      </div>
    </section>
  )
}
