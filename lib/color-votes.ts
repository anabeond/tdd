import { supabaseServer } from '@/lib/supabase-server'
import { COLOR_KEYS, type ColorKey } from '@/lib/colors'

export type ColorTally = {
  totalSubmissions: number
  percentages: Record<ColorKey, number>
}

/**
 * Live mural breakdown. color_votes has RLS with no policies, so this must run
 * server-side through the service-role client.
 */
export async function getColorTally(): Promise<ColorTally> {
  const { data: rows } = await supabaseServer.from('color_votes').select('color')

  const counts: Record<ColorKey, number> = Object.fromEntries(COLOR_KEYS.map((k) => [k, 0])) as Record<
    ColorKey,
    number
  >
  for (const row of rows ?? []) {
    const key = row.color as ColorKey
    if (key in counts) counts[key] += 1
  }

  const total = rows?.length ?? 0
  const percentages: Record<ColorKey, number> = Object.fromEntries(
    COLOR_KEYS.map((k) => [k, total > 0 ? (counts[k] / total) * 100 : 0])
  ) as Record<ColorKey, number>

  return { totalSubmissions: total, percentages }
}
