import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function CheckoutFailure() {
  return (
    <main className="bg-dark-blue min-h-screen">
      <Navbar />
      <section className="px-4 md:px-page pt-28 md:pt-40 pb-16 md:pb-24 flex flex-col items-center justify-center text-center gap-8 max-w-[560px] mx-auto">
        <div className="flex flex-col gap-4">
          <p className="text-dojo-white/60 text-[13px] uppercase tracking-[0.08em]">Pago no completado</p>
          <h1
            className="font-semibold text-dojo-white"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            Hubo un problema con el pago.
          </h1>
          <p className="text-dojo-white/65 text-[18px] leading-[1.5]">
            No se realizó ningún cobro. Podés intentarlo de nuevo o escribirnos si el problema persiste.
          </p>
        </div>
        <div className="flex gap-6">
          <Link
            href="/programs"
            className="text-dojo-white/60 text-[15px] underline underline-offset-4 hover:text-dojo-white transition-colors"
          >
            Ver programas
          </Link>
          <Link
            href="/"
            className="text-dojo-white/60 text-[15px] underline underline-offset-4 hover:text-dojo-white transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
