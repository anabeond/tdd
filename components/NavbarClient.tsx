'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { IconBrandTwitch, IconBrandFigma, IconBrandInstagram, IconMenu2, IconX } from '@tabler/icons-react'
import { NavDropdown } from '@/components/ui/NavDropdown'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useTheme } from '@/components/ThemeProvider'

type NavProduct = { slug: string; title: string; category: string }

type NavbarClientProps = {
  programs: NavProduct[]
  courses: NavProduct[]
}

function NavLabel({ label, active }: { label: string; active?: boolean }) {
  return (
    <span className="relative overflow-hidden flex" aria-label={label}>
      {/* Top layer — slides up on hover */}
      <span className="flex" aria-hidden="true">
        {label.split('').map((char, i) => (
          <span
            key={i}
            className={`inline-block transition-transform duration-300 group-hover:-translate-y-full ${active ? 'text-accent' : ''}`}
            style={{ transitionDelay: `${i * 18}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
      {/* Bottom layer — rises into view on hover */}
      <span className="absolute inset-0 flex text-accent" aria-hidden="true">
        {label.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 18}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </span>
  )
}

export default function NavbarClient({ programs, courses }: NavbarClientProps) {
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const NAV_ITEMS = [
    { label: 'EL DOJO', href: '/the-dojo', dropdown: false },
    {
      label: 'PROGRAMAS',
      href: '/programs',
      dropdown: true,
      dropdownItems: [
        { label: 'Todos los Programas', href: '/programs' },
        ...programs.map((p) => ({ label: p.title, href: `/programs/${p.slug}` })),
      ],
    },
    {
      label: 'CURSOS',
      href: '/courses',
      dropdown: true,
      dropdownItems: [
        { label: 'Todos los Cursos', href: '/courses' },
        ...courses.map((c) => ({ label: c.title, href: `/courses/${c.slug}` })),
      ],
    },
  ]

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 z-50 flex items-center justify-between py-8"
        animate={{
          top: scrolled ? 0 : 32,
          height: scrolled ? 56 : 104,
        }}
        style={{
          paddingInline: '1em',
          backgroundColor: 'var(--dark-blue)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Logo */}
        <Link href="/" className="block cursor-pointer w-[160px] md:w-[248px]" aria-label="Go to home">
          <motion.img
            src="/images/logo-navbar.svg"
            alt="The Design Dojo"
            width={248}
            height={40}
            className="block w-[160px] md:w-[248px] h-auto object-contain origin-left"
            animate={{
              scale: scrolled ? 0.7016 : 1,
              filter: theme === 'light' ? 'brightness(0) saturate(100%)' : 'none',
            }}
            whileHover={{
              filter:
                'brightness(0) saturate(100%) invert(23%) sepia(92%) saturate(2921%) hue-rotate(11deg) brightness(99%) contrast(95%)',
            }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={item.href}
                className="group flex items-center gap-1 font-semibold text-[14px] text-dojo-white tracking-[2.8px]"
              >
                <NavLabel label={item.label} active={!item.href.startsWith('#') && pathname === item.href} />
                {item.dropdown && (
                  <motion.span
                    className="text-[10px] opacity-50 ml-0.5"
                    animate={{ rotate: openDropdown === item.label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▾
                  </motion.span>
                )}
              </a>

              <NavDropdown open={item.dropdown && openDropdown === item.label}>
                {item.dropdownItems?.length ? (
                  item.dropdownItems.map((dropdownItem) =>
                    dropdownItem.href ? (
                      <a
                        key={dropdownItem.label}
                        href={dropdownItem.href}
                        className="font-semibold text-[14px] text-dojo-white tracking-[0.5px] hover:text-black transition-colors duration-200"
                      >
                        {dropdownItem.label}
                      </a>
                    ) : (
                      <span
                        key={dropdownItem.label}
                        className="font-semibold text-[14px] text-dojo-white tracking-[0.5px] hover:text-black transition-colors duration-200"
                      >
                        {dropdownItem.label}
                      </span>
                    )
                  )
                ) : null}
              </NavDropdown>
            </div>
          ))}
        </nav>

        {/* Desktop Social Icon + Theme Toggle */}
        <div className="hidden md:flex w-[248px] justify-end items-center gap-4">
          <ThemeToggle />
          <a
            href="https://twitch.tv/thedesigndojo"
            target="_blank"
            rel="noopener noreferrer"
            className="size-8 opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Twitch"
          >
            <IconBrandTwitch className="size-full text-dojo-white" stroke={1.7} />
          </a>
          <a
            href="https://www.figma.com/@thedesigndojo"
            target="_blank"
            rel="noopener noreferrer"
            className="size-8 opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Figma"
          >
            <IconBrandFigma className="size-full text-dojo-white" stroke={1.7} />
          </a>
          <a
            href="https://www.instagram.com/the.design.dojo"
            target="_blank"
            rel="noopener noreferrer"
            className="size-8 opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Instagram"
          >
            <IconBrandInstagram className="size-full text-dojo-white" stroke={1.7} />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center size-8 text-dojo-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.span
                key="x"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <IconX size={24} stroke={1.7} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <IconMenu2 size={24} stroke={1.7} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.header>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-dark-blue flex flex-col px-8 pt-32 pb-12 md:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <nav className="flex flex-col gap-6 flex-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-semibold text-[22px] text-dojo-white tracking-[2px]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-4">
                <a
                  href="https://twitch.tv/thedesigndojo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-dojo-white/60"
                  aria-label="Twitch"
                >
                  <IconBrandTwitch size={24} stroke={1.7} />
                  <span className="font-medium text-[14px] tracking-widest uppercase">Twitch</span>
                </a>
                <a
                  href="https://www.figma.com/@thedesigndojo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-dojo-white/60"
                  aria-label="Figma"
                >
                  <IconBrandFigma size={24} stroke={1.7} />
                  <span className="font-medium text-[14px] tracking-widest uppercase">Figma</span>
                </a>
                <a
                  href="https://www.instagram.com/the.design.dojo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-dojo-white/60"
                  aria-label="Instagram"
                >
                  <IconBrandInstagram size={24} stroke={1.7} />
                  <span className="font-medium text-[14px] tracking-widest uppercase">Instagram</span>
                </a>
              </div>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
