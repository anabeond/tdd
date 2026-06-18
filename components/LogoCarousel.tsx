'use client'

const LOGOS = [
  { name: 'Figma',    src: '/images/appslogos/figma.png'    },
  { name: 'Claude',   src: '/images/appslogos/claude.png'   },
  { name: 'Adobe',    src: '/images/appslogos/adobe.png'    },
  { name: 'Supabase', src: '/images/appslogos/supabase.png' },
  { name: 'Notion',   src: '/images/appslogos/notion.png'   },
  { name: 'Lottie',   src: '/images/appslogos/lottie.svg'   },
]

function LogoItem({ name, src }: { name: string; src: string }) {
  return (
    <div className="flex items-center opacity-25 cursor-default select-none pr-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} style={{ height: 22, width: 'auto' }} />
    </div>
  )
}

export default function LogoCarousel() {
  return (
    <section className="w-full overflow-hidden border-y border-dojo-white/10 py-6">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 18s linear infinite;
        }
      `}</style>
      <div className="marquee-track flex items-center" style={{ width: 'max-content' }}>
        {/* Two identical sets — when we've scrolled one full set (-50%), it looks identical to the start */}
        <div className="flex items-center" aria-hidden="true">
          {LOGOS.map(({ name, src }) => <LogoItem key={name} name={name} src={src} />)}
        </div>
        <div className="flex items-center" aria-hidden="true">
          {LOGOS.map(({ name, src }) => <LogoItem key={`${name}-2`} name={name} src={src} />)}
        </div>
      </div>
    </section>
  )
}
