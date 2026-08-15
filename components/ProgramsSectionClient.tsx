'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Tab } from '@/components/ui/Tab'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { ProductImage } from '@/components/ui/ProductImage'
import { IconArrowRight } from '@tabler/icons-react'
import type { ProductCard } from '@/lib/products'
import { PRODUCT_TYPE_LABELS, getCtaLabel } from '@/lib/productType'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
}

const TABS = ['Todo el Contenido', 'Programas', 'Cursos']

function ProductCard({ card }: { card: ProductCard }) {
  const available = card.status === 'available'
  const ctaLabel = getCtaLabel(card.productType, card.status)

  return (
    <motion.div className="flex flex-col gap-8 w-full shrink-0 w-[85vw] sm:w-[420px]" variants={cardVariants}>
      <a href={card.href} className="block group cursor-pointer">
        {/* Photo — no rounded corners, matches Figma. Aspect 597:720 from design spec */}
        <div className="overflow-hidden w-full relative" style={{ aspectRatio: '597/720' }}>
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <ProductImage
              src={card.image}
              alt={card.title}
              className="object-cover object-center"
              placeholder={<div className="w-full h-full bg-dojo-white/10" />}
            />
          </motion.div>
        </div>
      </a>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <a href={card.href} className="block group cursor-pointer">
          <p
            className="font-medium text-[14px] md:text-[24px] text-dojo-white"
            style={{ letterSpacing: '-0.48px' }}
          >
            /{card.category}
          </p>
        </a>
        <div className="h-px w-full bg-dojo-white/30" />
        <a href={card.href} className="block group cursor-pointer">
          <p
            className="font-semibold text-[20px] md:text-[32px] text-dojo-white"
            style={{ letterSpacing: '-0.64px', lineHeight: 1.15 }}
          >
            {card.title}
          </p>
          <p
            className="font-light text-[20px] md:text-[32px] text-dojo-white/80 flex items-center gap-2"
            style={{ letterSpacing: '-0.64px' }}
          >
            <IconArrowRight className="shrink-0" style={{ width: '0.9em', height: '0.9em' }} strokeWidth={1.5} />
            {card.subtitle}
          </p>
        </a>
        <div className="flex gap-2 items-center flex-wrap">
          <Tag label={PRODUCT_TYPE_LABELS[card.productType]} />
          {card.badge && <Tag label={card.badge} variant="badge" />}
          {card.meta && (
            <span
              className="font-semibold text-[16px] text-dojo-white flex items-center gap-1"
              style={{ letterSpacing: '-0.32px' }}
            >
              <IconArrowRight className="shrink-0" style={{ width: '0.9em', height: '0.9em' }} strokeWidth={1.5} />
              {card.meta}
            </span>
          )}
        </div>

        {/* Buy CTA — always leads to Hotmart checkout, never handled on this site */}
        <div className="flex items-center gap-4 pt-2">
          {card.priceDisplay && (
            <span className="text-dojo-white/60 text-[15px] font-medium">{card.priceDisplay}</span>
          )}
          {available ? (
            <Button
              href={card.hotmartCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="underline"
              className="text-[15px] text-dojo-white border-accent border-b-2 hover:text-accent"
            >
              {ctaLabel}
              <IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
            </Button>
          ) : (
            <span className="font-bold text-[15px] text-dojo-white/30 cursor-not-allowed">{ctaLabel}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProgramsSectionClient({ cards }: { cards: ProductCard[] }) {
  const [activeTab, setActiveTab] = useState('Todo el Contenido')

  const filtered =
    activeTab === 'Todo el Contenido'
      ? cards
      : activeTab === 'Programas'
      ? cards.filter((c) => c.category === 'programa')
      : cards.filter((c) => c.category === 'curso')

  return (
    <section id="programs" className="w-full px-4 md:px-page py-8">
      <div className="flex flex-col gap-8 w-full">
        {/* Tabs */}
        <motion.div
          className="flex gap-2 pr-4 md:pr-page"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </motion.div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="flex items-start gap-0 overflow-x-auto pb-4 pr-page"
            style={{ scrollbarWidth: 'none' }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            exit={{ opacity: 0 }}
          >
            {filtered.map((card) => (
              <ProductCard key={card.id} card={card} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
