'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import { useConsent } from '@/components/CookieConsent'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function AnalyticsGate() {
  const { consent } = useConsent()

  if (!GA_ID || consent !== 'accepted') return null

  return <GoogleAnalytics gaId={GA_ID} />
}
