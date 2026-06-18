'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import Image from 'next/image'
import { Tab } from '@/components/ui/Tab'
import { Tag } from '@/components/ui/Tag'
import { IconArrowRight } from '@tabler/icons-react'
import type { ProductCard } from '@/lib/products'

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
  return (
    <a href={card.href} className="block shrink-0 w-[85vw] sm:w-[420px]">
      <motion.div
        className="flex flex-col gap-8 w-full group cursor-pointer"
        variants={cardVariants}
      >
        {/* Photo — no rounded corners, matches Figma. Aspect 597:720 from design spec */}
        <div className="overflow-hidden w-full relative" style={{ aspectRatio: '597/720' }}>
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {card.image ? (
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-dojo-white/10" />
            )}
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          <p
            className="font-medium text-[14px] md:text-[24px] text-dojo-white"
            style={{ letterSpacing: '-0.48px' }}
          >
            /{card.category}
          </p>
          <div className="h-px w-full bg-dojo-white/30" />
          <div>
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
          </div>
          <div className="flex gap-2 items-center">
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
        </div>
      </motion.div>
    </a>
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
