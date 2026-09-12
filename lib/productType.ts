import type { ProductStatus, ProductType } from '@/lib/products'

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  online_course: 'Curso Online',
  ebook: 'Ebook',
  mentorship: 'Mentoría',
}

export function getCtaLabel(productType: ProductType, status: ProductStatus): string {
  if (status === 'sold_out') return 'Agotado'
  if (status === 'coming_soon') return 'Próximamente'
  return productType === 'mentorship' ? 'Reservar' : 'Inscribirme'
}
