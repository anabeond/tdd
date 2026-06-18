import Image from 'next/image'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { IconArrowRight } from '@tabler/icons-react'
import { getFeaturedProduct } from '@/lib/products'

export default async function Highlight() {
  const program = await getFeaturedProduct()
  if (!program) return null

  return (
    <section className="relative w-full overflow-hidden bg-dark-blue min-h-[420px] md:min-h-[791px]">
      {/* Background image — right side, fading left */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vintage TV texture overlay */}
        <div className="absolute inset-0 z-10 bg-dark-blue/80 mix-blend-overlay" />
        <Image
          src="/images/highlight-vintage-tv.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
        />
        {/* Gradient fade — content side */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-dark-blue via-dark-blue/90 to-transparent" />
        {/* Featured person image — right */}
        <div className="absolute right-0 top-0 h-full w-[55%] z-10">
          <Image
            src="/images/highlight-person.png"
            alt="Featured"
            fill
            className="object-cover object-top"
            priority
          />
          {/* Inner gradient to blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-blue/95 via-dark-blue/40 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-30 flex flex-col justify-center h-full px-4 md:px-page py-16 md:py-[235px] gap-8">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <h2
            className="font-semibold text-dojo-white"
            style={{ fontSize: 'clamp(48px, 4.17vw, 80px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            {program.title}
          </h2>

          {/* Subtitle */}
          <p
            className="font-semibold text-dojo-white"
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
            className="text-[32px] text-dojo-white border-accent border-b-2 hover:text-accent"
          >
            Ver Programa
            <IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
          </Button>
        </div>
      </div>
    </section>
  )
}
