import { getProductCards } from '@/lib/products'
import ProgramsSectionClient from '@/components/ProgramsSectionClient'

export default async function ProgramsSection() {
  const cards = await getProductCards()
  return <ProgramsSectionClient cards={cards} />
}
