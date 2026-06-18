import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function CheckoutSuccess() {
  return (
    <main className="bg-dark-blue min-h-screen">
      <Navbar />
      <section className="px-4 md:px-page pt-28 md:pt-40 pb-16 md:pb-24 flex flex-col items-center justify-center text-center gap-8 max-w-[560px] mx-auto">
        <div className="flex flex-col gap-4">
          <p className="text-dojo-white/60 text-[13px] uppercase tracking-[0.08em]">Pago aprobado</p>
          <h1
            className="font-semibold text-dojo-white"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            ¡Listo! Tu compra fue exitosa.
          </h1>
          <p className="text-dojo-white/65 text-[18px] leading-[1.5]">
            En unos minutos vas a recibir un email con los detalles de acceso a tu curso. Revisá también la bandeja de spam.
          </p>
        </div>
        <Link
          href="/"
          className="text-dojo-white/60 text-[15px] underline underline-offset-4 hover:text-dojo-white transition-colors"
        >
          Volver al inicio
        </Link>
      </section>
      <Footer />
    </main>
  )
}
