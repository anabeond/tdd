import type { MetadataRoute } from 'next'
import { supabaseServer } from '@/lib/supabase-server'

const BASE_URL = 'https://thedesigndojo.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: products } = await supabaseServer
    .from('products')
    .select('slug, category, created_at')
    .eq('active', true)

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE_URL}/${p.category === 'curso' ? 'courses' : 'programs'}/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/programs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/the-dojo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/ai-approach`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...productUrls,
  ]
}
