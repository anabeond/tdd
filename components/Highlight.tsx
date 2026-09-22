import Image from 'next/image'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { IconArrowRight } from '@tabler/icons-react'
import { getFeaturedProduct } from '@/lib/products'

export default async function Highlight() {
  const program = await getFeaturedProduct()
  if (!program) return null

  const heroImage = program.heroImage || '/images/highlight-person.png'
  const heroImageMobile = program.heroImageMobile || heroImage

  return (
    <section className="relative w-full overflow-hidden bg-dark-blue aspect-[1320/1832] md:aspect-auto md:min-h-[791px]">
      {/* Background image — right side, fading left */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 z-10 bg-dark-blue/80 mix-blend-overlay" />
        {/* Featured product image — full bleed */}
        <div className="absolute inset-0 z-10">
          {heroImageMobile !== heroImage ? (
            <>
              <Image
                src={heroImageMobile}
                alt={program.title}
                fill
                className="md:hidden object-cover object-center"
                priority
              />
              <Image
                src={heroImage}
                alt={program.title}
                fill
                className="hidden md:block object-contain object-right"
                priority
              />
            </>
          ) : (
            <Image
              src={heroImage}
              alt={program.title}
              fill
              className="object-contain object-right"
              priority
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-30 flex flex-col justify-center h-full px-4 md:px-page py-16 md:py-[235px] gap-8">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <h2
            className="font-semibold text-[#fafafa]"
            style={{ fontSize: 'clamp(48px, 4.17vw, 80px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            {program.title}
          </h2>

          {/* Subtitle */}
          <p
            className="font-semibold text-[#fafafa]"
            style={{ fontSize: 'clamp(20px, 1.67vw, 32px)', letterSpacing: '-0.02em' }}
          >
            {program.subtitle}
          </p>
        </div>

        {/* Tags */}
        {program.highlightTags && program.highlightTags.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {program.highlightTags.map((tag) => (
              <Tag key={tag.label} label={tag.label} icon={tag.icon} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div>
          <Button
            href={`/programs/${program.slug}`}
            variant="underline"
            className="text-[32px] text-[#fafafa] border-accent border-b-2 hover:text-accent"
          >
            Ver Programa
            <IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
          </Button>
        </div>
      </div>
    </section>
  )
}
