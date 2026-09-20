import Image from 'next/image'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Página no encontrada',
}

export default function NotFound() {
  return (
    <main className="bg-dark-blue text-dojo-white min-h-screen flex items-center justify-center px-4 md:px-page py-24">
      <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
        <p
          className="font-extralight leading-none"
          style={{ fontSize: 'clamp(96px, 18vw, 256px)' }}
        >
          404
        </p>

        <div className="flex flex-col gap-4 md:max-w-[497px]">
          <Image
            src="/images/logo-navbar.svg"
            alt="The Design Dojo"
            width={248}
            height={40}
            priority
            // White-fill asset: force it black on the light theme (and before hydration
            // sets data-theme), the same way the navbar does.
            className="w-[180px] md:w-[248px] h-auto [html:not([data-theme='dark'])_&]:[filter:brightness(0)_saturate(100%)]"
          />
          <p className="font-normal" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            Página no encontrada
          </p>
          <Button
            href="/"
            variant="secondary"
            className="font-normal self-start"
            style={{ fontSize: 'clamp(20px, 2.6vw, 32px)' }}
          >
            →Volver a la Home
          </Button>
        </div>
      </div>
    </main>
  )
}
