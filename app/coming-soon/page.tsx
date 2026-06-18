import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coming Soon',
  description: 'Design Dojo is coming soon.',
  robots: { index: false, follow: false },
}

export default function ComingSoonPage() {
  return (
    <main className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-dark-blue text-dojo-white px-page">
      <Image
        src="/images/logo-navbar.svg"
        alt="The Design Dojo"
        width={320}
        height={52}
        priority
        className="w-[240px] md:w-[320px] h-auto"
      />
      <p
        className="text-dojo-white/80 text-center"
        style={{ fontSize: 'clamp(16px, 2.4vw, 24px)', letterSpacing: '-0.01em' }}
      >
        Design Dojo is coming soon.
      </p>
    </main>
  )
}
