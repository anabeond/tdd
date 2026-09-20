'use client'

import { useTheme } from '@/components/ThemeProvider'

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer className="w-full bg-dojo-white">
      <div className="flex flex-col gap-4 px-4 md:px-page py-8 text-dark-blue">
        {/* Logo 96×96 */}
        <div className="size-24 shrink-0">
          <img
            src="/images/logo-footer.svg"
            alt="The Design Dojo"
            className="w-full h-full object-contain object-left"
            style={{ filter: theme === 'dark' ? 'brightness(0) saturate(100%)' : 'none' }}
          />
        </div>

        {/* Text block — gap-64px between branding and bottom row */}
        <div className="flex flex-col gap-16 w-full">
          {/* Branding */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-[18px] leading-none">The Design Dojo</p>
            <p className="font-normal text-[12px] tracking-[0.56px] uppercase opacity-80">
              <a href="https://www.instagram.com/the.design.dojo" target="_blank" rel="noopener noreferrer">@the.design.dojo</a>
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between w-full">
            <p className="font-light text-[10px] tracking-[0.48px]">
              Todos los derechos reservados. The Design Dojo 2026.{' '}
              <span className="font-semibold">Argentina.</span>
            </p>
            <p className="font-medium text-[10px] sm:text-right sm:shrink-0 sm:pl-8">
              Do it for Design.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
