import { supabaseServer } from '@/lib/supabase-server'
import type { ProgramTemplateData } from '@/components/Program-Template'
import type { CourseTemplateData } from '@/components/Course-Template'

export type ProductType = 'online_course' | 'ebook' | 'mentorship'
export type ProductStatus = 'available' | 'coming_soon' | 'sold_out'
export type ProductSeason = 'fall' | 'winter' | 'spring' | 'summer'

type ProductRow = {
  id: number
  slug: string
  title: string
  subtitle: string | null
  long_description: string | null
  featured_image: string | null
  featured_image_mobile: string | null
  thumbnail: string | null
  duration: string | null
  level: string | null
  format: string | null
  price_usd: string | null
  price_ars: string | null
  hotmart_checkout_url: string | null
  outcomes: string[]
  target_audience: string[]
  not_for: string[]
  modules: { title: string; description: string }[]
  cta_text: string | null
  category: string | null
  featured: boolean
  highlight_tags: { icon: string; label: string }[]
  active: boolean
  product_type: ProductType
  season: ProductSeason | null
  status: ProductStatus
}

function toProgram(row: ProductRow): ProgramTemplateData {
  return {
    slug: row.slug,
    badge: row.category ?? 'programa',
    title: row.title,
    subtitle: row.subtitle ?? '',
    overview: row.long_description ?? '',
    heroImage: row.featured_image ?? '',
    heroImageMobile: row.featured_image_mobile ?? row.featured_image ?? '',
    duration: row.duration ?? '',
    level: row.level ?? '',
    format: row.format ?? '',
    priceUsd: row.price_usd ?? '',
    priceArs: row.price_ars ?? '',
    hotmartCheckoutUrl: row.hotmart_checkout_url ?? '',
    outcomes: row.outcomes ?? [],
    targetAudience: row.target_audience ?? [],
    notFor: row.not_for ?? [],
    modules: row.modules ?? [],
    ctaLabel: row.cta_text ?? 'Ver programa',
    featured: row.featured,
    highlightTags: row.highlight_tags ?? [],
    productType: row.product_type,
    status: row.status,
  }
}

function toCourse(row: ProductRow): CourseTemplateData {
  return {
    slug: row.slug,
    badge: row.category ?? 'sprint',
    title: row.title,
    subtitle: row.subtitle ?? '',
    overview: row.long_description ?? '',
    heroImage: row.featured_image ?? '',
    heroImageMobile: row.featured_image_mobile ?? row.featured_image ?? '',
    duration: row.duration ?? '',
    level: row.level ?? '',
    format: row.format ?? '',
    priceUsd: row.price_usd ?? '',
    priceArs: row.price_ars ?? '',
    hotmartCheckoutUrl: row.hotmart_checkout_url ?? '',
    outcomes: row.outcomes ?? [],
    targetAudience: row.target_audience ?? [],
    notFor: row.not_for ?? [],
    modules: row.modules ?? [],
    ctaLabel: row.cta_text ?? 'Empezar el curso',
    productType: row.product_type,
    status: row.status,
  }
}

export async function getPrograms(): Promise<ProgramTemplateData[]> {
  const { data } = await supabaseServer
    .from('products')
    .select('*')
    .eq('category', 'programa')
    .eq('active', true)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('id')
  return (data as ProductRow[] ?? []).map(toProgram)
}

export async function getCourses(): Promise<CourseTemplateData[]> {
  const { data } = await supabaseServer
    .from('products')
    .select('*')
    .eq('category', 'sprint')
    .eq('active', true)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('id')
  return (data as ProductRow[] ?? []).map(toCourse)
}

export async function getProgramBySlug(slug: string): Promise<ProgramTemplateData | null> {
  const { data } = await supabaseServer
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('category', 'programa')
    .eq('active', true)
    .neq('status', 'coming_soon')
    .single()
  return data ? toProgram(data as ProductRow) : null
}

export async function getCourseBySlug(slug: string): Promise<CourseTemplateData | null> {
  const { data } = await supabaseServer
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('category', 'sprint')
    .eq('active', true)
    .neq('status', 'coming_soon')
    .single()
  return data ? toCourse(data as ProductRow) : null
}

export type ProductCard = {
  id: number
  slug: string
  category: string
  productType: ProductType
  status: ProductStatus
  image: string
  title: string
  subtitle: string
  badge: string | null
  meta: string | null
  href: string
  hotmartCheckoutUrl: string
  priceUsd: string
  priceArs: string
}

export async function getProductCards(): Promise<ProductCard[]> {
  const { data } = await supabaseServer
    .from('products')
    .select(
      'id, slug, title, subtitle, thumbnail, featured_image, launch_label, duration, category, product_type, status, hotmart_checkout_url, price_usd, price_ars'
    )
    .eq('active', true)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('id')
  if (!data) return []
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    category: row.category ?? '',
    productType: row.product_type,
    status: row.status,
    image: row.thumbnail ?? row.featured_image ?? '',
    title: row.title,
    subtitle: row.subtitle ?? '',
    badge: row.launch_label ?? null,
    meta: row.duration ?? null,
    href: row.category === 'sprint' ? `/courses/${row.slug}` : `/programs/${row.slug}`,
    hotmartCheckoutUrl: row.hotmart_checkout_url ?? '',
    priceUsd: row.price_usd ?? '',
    priceArs: row.price_ars ?? '',
  }))
}

export async function getProductsForNav() {
  const { data } = await supabaseServer
    .from('products')
    .select('slug, title, category')
    .eq('active', true)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('id')
  return (data ?? []) as { slug: string; title: string; category: string }[]
}

export type ComingSoonData = {
  slug: string
  badge: string
  title: string
  subtitle: string
  description: string
  featuredImage: string
  thumbnail: string
}

export async function getComingSoonBySlug(
  slug: string,
  category: 'programa' | 'sprint'
): Promise<ComingSoonData | null> {
  const { data } = await supabaseServer
    .from('products')
    .select('slug, title, subtitle, long_description, category, featured_image, thumbnail')
    .eq('slug', slug)
    .eq('category', category)
    .eq('status', 'coming_soon')
    .single()
  if (!data) return null
  const row = data as Pick<ProductRow, 'slug' | 'title' | 'subtitle' | 'long_description' | 'category' | 'featured_image' | 'thumbnail'>
  return {
    slug: row.slug,
    badge: row.category ?? 'próximamente',
    title: row.title,
    subtitle: row.subtitle ?? '',
    description: row.long_description ?? '',
    featuredImage: row.featured_image ?? '',
    thumbnail: row.thumbnail ?? '',
  }
}

export async function getFeaturedProduct(): Promise<ProgramTemplateData | null> {
  const { data } = await supabaseServer
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('active', true)
    .limit(1)
    .single()
  if (data) return toProgram(data as ProductRow)

  // Fall back to first active product
  const { data: first } = await supabaseServer
    .from('products')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('id')
    .limit(1)
    .single()
  return first ? toProgram(first as ProductRow) : null
}
