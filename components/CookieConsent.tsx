'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Consent = 'pending' | 'accepted' | 'declined'

const CookieConsentContext = createContext<{
  consent: Consent
  accept: () => void
  decline: () => void
}>({
  consent: 'pending',
  accept: () => {},
  decline: () => {},
})

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent>('pending')

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent') as Consent | null
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setConsent(stored)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setConsent('accepted')
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setConsent('declined')
  }

  return (
    <CookieConsentContext.Provider value={{ consent, accept, decline }}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useConsent() {
  return useContext(CookieConsentContext)
}

export function CookieConsentBanner() {
  const { consent, accept, decline } = useConsent()

  return (
    <AnimatePresence>
      {consent === 'pending' && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[70] bg-dark-blue text-dojo-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-t border-dojo-white/15"
        >
          <p className="text-[13px] leading-snug max-w-2xl">
            Usamos cookies para entender cómo usás el sitio y mejorar tu experiencia. Podés aceptar o rechazar el uso de cookies de análisis.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={decline}
              className="text-[13px] font-medium px-4 py-2 rounded-full border border-dojo-white/30 hover:bg-dojo-white/10 transition-colors duration-200"
            >
              Rechazar
            </button>
            <button
              onClick={accept}
              className="text-[13px] font-medium px-4 py-2 rounded-full bg-dojo-white text-dark-blue hover:bg-dojo-white/90 transition-colors duration-200"
            >
              Aceptar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
