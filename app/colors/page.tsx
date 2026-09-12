import type { Metadata } from 'next'
import ColorsPageClient from '@/components/ColorsPageClient'
import { getColorTally } from '@/lib/color-votes'

export const metadata: Metadata = {
  title: 'Colors',
  description: 'Elegí tu color favorito y sumate al mural de colores del Dojo.',
  robots: { index: false, follow: false },
}

// The participant count is live, so the page can't be cached.
export const dynamic = 'force-dynamic'

export default async function ColorsPage() {
  return <ColorsPageClient initialTally={await getColorTally()} />
}
