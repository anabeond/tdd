import { getProductsForNav } from '@/lib/products'
import NavbarClient from '@/components/NavbarClient'

export default async function Navbar() {
  const products = await getProductsForNav()
  const programs = products.filter((p) => p.category === 'programa')
  const courses = products.filter((p) => p.category === 'sprint')

  return <NavbarClient programs={programs} courses={courses} />
}
