import { supabaseServer } from '@/lib/supabase-server'
import type { ProgramTemplateData } from '@/components/Program-Template'
import type { CourseTemplateData } from '@/components/Course-Template'

type ProductRow = {
  id: number
  slug: string
  title: string
  subtitle: string | null
  long_description: string | null
  featured_image: string | null
  duration: string | null
  level: string | null
  format: string | null
  price: string // numeric comes as string from supabase-js
  thinkific_url: string | null
  outcomes: string[]
  modules: { title: string; description: string }[]
  cta_text: string | null
  category: string | null
  featured: boolean
  highlight_tags: { icon: string; label: string }[]
  active: boolean
  coming_soon: boolean
}

function toProgram(row: ProductRow): ProgramTemplateData {
  return {
    slug: row.slug,
    badge: row.category ?? 'programa',
    title: row.title,
    subtitle: row.subtitle ?? '',
    overview: row.long_description ?? '',
    heroImage: row.featured_image ?? '',
    duration: row.duration ?? '',
    level: row.level ?? '',
    format: row.format ?? '',
    price: Number(row.price),
    thinkificUrl: row.thinkific_url ?? '',
    outcomes: row.outcomes ?? [],
    modules: row.modules ?? [],
    ctaLabel: row.cta_text ?? 'Ver programa',
    featured: row.featured,
    highlightTags: row.highlight_tags ?? [],
  }
}

function toCourse(row: ProductRow): CourseTemplateData {
  return {
    slug: row.slug,
    badge: row.category ?? 'curso',
    title: row.title,
    subtitle: row.subtitle ?? '',
    overview: row.long_description ?? '',
    heroImage: row.featured_image ?? '',
    duration: row.duration ?? '',
    level: row.level ?? '',
    format: row.format ?? '',
    price: Number(row.price),
    thinkificUrl: row.thinkific_url ?? '',
    outcomes: row.outcomes ?? [],
    modules: row.modules ?? [],
    ctaLabel: row.cta_text ?? 'Empezar el curso',
  }
}

export async function getPrograms(): Promise<ProgramTemplateData[]> {
  const { data } = await supabaseServer
    .from('products')
    .select('*')
    .eq('category', 'programa')
    .eq('active', true)
    .order('id')
  return (data as ProductRow[] ?? []).map(toProgram)
}

export async function getCourses(): Promise<CourseTemplateData[]> {
  const { data } = await supabaseServer
    .from('products')
    .select('*')
    .eq('category', 'curso')
    .eq('active', true)
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
    .eq('coming_soon', false)
    .single()
  return data ? toProgram(data as ProductRow) : null
}

export async function getCourseBySlug(slug: string): Promise<CourseTemplateData | null> {
  const { data } = await supabaseServer
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('category', 'curso')
    .eq('active', true)
    .eq('coming_soon', false)
    .single()
  return data ? toCourse(data as ProductRow) : null
}

export async function getProductBySlug(slug: string) {
  const { data } = await supabaseServer
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()
  if (!data) return null
  const row = data as ProductRow
  return {
    slug: row.slug,
    title: row.title,
    price: Number(row.price),
    thinkificUrl: row.thinkific_url ?? '',
  }
}

export type ProductCard = {
  id: number
  slug: string
  category: string
  image: string
  title: string
  subtitle: string
  badge: string | null
  meta: string | null
  href: string
}

export async function getProductCards(): Promise<ProductCard[]> {
  const { data } = await supabaseServer
    .from('products')
    .select('id, slug, title, subtitle, thumbnail, featured_image, launch_label, duration, category')
    .eq('active', true)
    .order('id')
  if (!data) return []
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    category: row.category ?? '',
    image: row.thumbnail ?? row.featured_image ?? '',
    title: row.title,
    subtitle: row.subtitle ?? '',
    badge: row.launch_label ?? null,
    meta: row.duration ?? null,
    href: row.category === 'curso' ? `/courses/${row.slug}` : `/programs/${row.slug}`,
  }))
}

export async function getProductsForNav() {
  const { data } = await supabaseServer
    .from('products')
    .select('slug, title, category')
    .eq('active', true)
    .order('id')
  return (data ?? []) as { slug: string; title: string; category: string }[]
}

export type ComingSoonData = {
  slug: string
  badge: string
  title: string
  subtitle: string
  description: string
}

export async function getComingSoonBySlug(slug: string): Promise<ComingSoonData | null> {
  const { data } = await supabaseServer
    .from('products')
    .select('slug, title, subtitle, long_description, category')
    .eq('slug', slug)
    .eq('coming_soon', true)
    .single()
  if (!data) return null
  const row = data as Pick<ProductRow, 'slug' | 'title' | 'subtitle' | 'long_description' | 'category'>
  return {
    slug: row.slug,
    badge: row.category ?? 'próximamente',
    title: row.title,
    subtitle: row.subtitle ?? '',
    description: row.long_description ?? '',
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
    .order('id')
    .limit(1)
    .single()
  return first ? toProgram(first as ProductRow) : null
}
