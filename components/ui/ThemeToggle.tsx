'use client'

import { IconSun, IconMoon } from '@tabler/icons-react'
import { useTheme } from '@/components/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center gap-1 rounded-full border border-dojo-white/20 bg-dojo-white/5 backdrop-blur-sm px-4 py-2 cursor-pointer hover:border-dojo-white/40 transition-colors duration-300"
    >
      <span className="flex items-center gap-3">
        <IconMoon
          size={14}
          strokeWidth={2}
          className={`transition-colors duration-200 ${theme === 'dark' ? 'text-dojo-white' : 'text-dojo-white/30'}`}
        />
        <span className="text-dojo-white/20">·</span>
        <IconSun
          size={14}
          strokeWidth={2}
          className={`transition-colors duration-200 ${theme === 'light' ? 'text-dojo-white' : 'text-dojo-white/30'}`}
        />
      </span>
    </button>
  )
}
