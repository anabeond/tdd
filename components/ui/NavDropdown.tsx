'use client'

import { AnimatePresence, motion } from 'framer-motion'

type NavDropdownProps = {
  open: boolean
  children: React.ReactNode
}

export function NavDropdown({ open, children }: NavDropdownProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute top-full left-0 pt-3"
          style={{ transformOrigin: 'top left' }}
          initial={{ opacity: 0, x: -8, y: -8, rotate: -3 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          exit={{ opacity: 0, x: -6, y: -6, rotate: -2 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-[27rem] bg-accent border border-white/10 rounded-lg overflow-hidden">
            <div className="flex flex-col items-start text-left p-8 gap-6">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}