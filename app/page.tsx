import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Design Dojo — Aprendé Diseño UX/UI',
  description: 'Programas, sprints y mentorías de Diseño UX/UI para diseñadores latinoamericanos. Aprendé diseño real, con herramientas reales.',
  alternates: { canonical: 'https://thedesigndojo.com' },
}

import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { IconArrowRight } from '@tabler/icons-react'
import Hero from '@/components/Hero'
import Highlight from '@/components/Highlight'
import LogoCarousel from '@/components/LogoCarousel'
import ProgramsSection from '@/components/ProgramsSection'
import LivestreamsSection from '@/components/LivestreamsSection'
import MentorshipsSection from '@/components/MentorshipsSection'
import AttributesSection from '@/components/AttributesSection'
import SubscribeSection from '@/components/SubscribeSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-dark-blue min-h-screen">
      <Navbar />
      <Hero />
      <Highlight />

      {/* Break Container — hidden per design annotation, to be revealed when ready */}
      <div className="hidden" aria-hidden="true">
        <div className="flex items-center justify-between px-32 py-32 w-full">
          <div className="text-dojo-white font-medium text-5xl tracking-tight">
            <p>Sumate al Dojo por $5/mes y accedé a todo</p>
            <p>el contenido de forma ilimitada.</p>
          </div>
          <Button>
            Me Interesa <IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-16 md:gap-64 pt-8 md:pt-32 pb-0">
        <ProgramsSection />
        <AttributesSection />
        <LivestreamsSection />
        <MentorshipsSection />
      </div>

      <SubscribeSection />
      {/* <LogoCarousel /> */}
      <Footer />
    </main>
  )
}
