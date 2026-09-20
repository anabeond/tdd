import type { MetadataRoute } from 'next'
import { supabaseServer } from '@/lib/supabase-server'
import { SITE_URL } from '@/lib/site-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: products } = await supabaseServer
    .from('products')
    .select('slug, category, created_at')
    .eq('active', true)

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${SITE_URL}/${p.category === 'sprint' ? 'courses' : 'programs'}/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/programs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/the-dojo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...productUrls,
  ]
}
