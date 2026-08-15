'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import DojoBreak from '@/components/DojoBreak'
import BreakPicture from '@/components/BreakPicture'
import AttributesSection from '@/components/AttributesSection'
import { IconArrowRight } from '@tabler/icons-react'
import { PRODUCT_TYPE_LABELS, getCtaLabel } from '@/lib/productType'
import type { ProductStatus, ProductType } from '@/lib/products'

export type ProgramModule = {
	title: string
	description: string
}

export type ProgramTemplateData = {
	slug: string
	badge: string
	title: string
	subtitle: string
	overview: string
	heroImage: string
	duration: string
	level: string
	format: string
	priceDisplay: string
	hotmartCheckoutUrl: string
	outcomes: string[]
	modules: ProgramModule[]
	ctaLabel: string
	featured?: boolean
	highlightTags?: { icon: string; label: string }[]
	productType: ProductType
	status: ProductStatus
}

type ProgramTemplateProps = {
	program: ProgramTemplateData
}

export default function ProgramTemplate({ program }: ProgramTemplateProps) {
	return (
		<>
			{/* ── Main content ── */}
			<section className="w-full bg-dark-blue text-dojo-white px-4 md:px-page pt-24 md:pt-40 pb-16 md:pb-24">
				<div className="flex flex-col gap-16">
					<motion.div
						initial={{ opacity: 0, y: 26 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
						className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end"
					>
						<div className="flex flex-col gap-5">
							<div className="flex items-center gap-3">
								<p
									className="font-semibold text-dojo-white/75 uppercase"
									style={{ fontSize: 13, letterSpacing: '0.08em' }}
								>
									/{program.badge}
								</p>
								<Tag label={PRODUCT_TYPE_LABELS[program.productType]} />
							</div>
							<h1
								className="font-semibold"
								style={{ fontSize: 'clamp(40px, 6vw, 92px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}
							>
								{program.title}
							</h1>
							<p
								className="text-dojo-white/85"
								style={{ fontSize: 'clamp(20px, 2vw, 30px)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
							>
								{program.subtitle}
							</p>
						</div>

						<div className="grid grid-cols-3 gap-4 border border-dojo-white/20 p-4">
							<div className="flex flex-col gap-1">
								<span className="text-dojo-white/60 text-[11px] uppercase tracking-[1.5px]">Duracion</span>
								<span className="text-[16px] font-semibold">{program.duration}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-dojo-white/60 text-[11px] uppercase tracking-[1.5px]">Nivel</span>
								<span className="text-[16px] font-semibold">{program.level}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-dojo-white/60 text-[11px] uppercase tracking-[1.5px]">Formato</span>
								<span className="text-[16px] font-semibold">{program.format}</span>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
						className="relative w-full md:w-1/2 overflow-hidden"
						style={{ aspectRatio: '16 / 8' }}
					>
						<img src={program.heroImage} alt={program.title} className="w-full h-full object-cover" />
						<div className="absolute inset-0 bg-gradient-to-r from-dark-blue/45 via-dark-blue/10 to-transparent pointer-events-none" />
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-100px' }}
						transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
						className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12"
					>
						<div className="flex flex-col gap-5">
							<h2 className="font-semibold text-[34px] tracking-[-0.02em]">Overview</h2>
							<p className="text-dojo-white/85 text-[18px] leading-[1.55]">{program.overview}</p>
							<ul className="flex flex-col gap-2">
								{program.outcomes.map((outcome) => (
									<li key={outcome} className="text-dojo-white text-[16px] leading-[1.45]">
										{'-> '} {outcome}
									</li>
								))}
							</ul>
						</div>

						<div className="flex flex-col gap-4">
							<h2 className="font-semibold text-[34px] tracking-[-0.02em]">Modulos</h2>
							<div className="flex flex-col border border-dojo-white/20">
								{program.modules.map((module, index) => (
									<div
										key={module.title}
										className="p-5 border-b border-dojo-white/15 last:border-b-0"
									>
										<p className="text-dojo-white/60 text-[12px] uppercase tracking-[1.4px]">Modulo {index + 1}</p>
										<h3 className="font-semibold text-[22px] tracking-[-0.02em] mt-1">{module.title}</h3>
										<p className="text-dojo-white/82 text-[15px] leading-[1.5] mt-2">{module.description}</p>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* ── Visual break ── */}
			<DojoBreak />

			{/* ── CTA / Pricing ── */}
			<section className="w-full bg-dark-blue text-dojo-white px-4 md:px-page py-12 md:py-24">
				<motion.div
					className="flex flex-col md:flex-row md:items-stretch border border-dojo-white/10"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-60px' }}
					transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				>
					{/* Left — title + subtitle */}
					<div className="flex-1 flex flex-col justify-between gap-8 p-8 md:p-16 border-b md:border-b-0 md:border-r border-dojo-white/10">
						<p className="font-medium text-dojo-white/40 text-[13px] uppercase tracking-[0.1em]">/{program.badge}</p>
						<div className="flex flex-col gap-4">
							<h2
								className="font-semibold text-dojo-white"
								style={{ fontSize: 'clamp(32px, 3.5vw, 60px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
							>
								{program.title}
							</h2>
							<p
								className="font-light text-dojo-white/60 flex items-center gap-2"
								style={{ fontSize: 'clamp(18px, 1.6vw, 26px)', letterSpacing: '-0.02em' }}
							>
								<IconArrowRight className="shrink-0" style={{ width: '0.9em', height: '0.9em' }} strokeWidth={1.5} />
								{program.subtitle}
							</p>
						</div>
						<div className="h-px bg-dojo-white/10" />
					</div>

					{/* Right — price + buttons */}
					<div className="w-full md:w-[480px] md:shrink-0 flex flex-col justify-between gap-8 p-8 md:p-16">
						<div className="flex flex-col gap-2">
							<p className="font-medium text-dojo-white/40 text-[13px] uppercase tracking-[0.1em]">Valor del Programa</p>
							{program.priceDisplay && (
								<p
									className="font-semibold text-dojo-white"
									style={{ fontSize: 'clamp(40px, 4vw, 72px)', letterSpacing: '-0.03em', lineHeight: 1 }}
								>
									{program.priceDisplay}
								</p>
							)}
						</div>

						<div className="flex flex-col gap-3">
							{program.status === 'available' ? (
								<Button
									href={program.hotmartCheckoutUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="w-full justify-center text-[16px]"
								>
									{getCtaLabel(program.productType, program.status)}
								</Button>
							) : (
								<span className="inline-flex items-center justify-center gap-4 font-medium text-[16px] tracking-[-0.02em] text-dojo-white/30 cursor-not-allowed border border-dojo-white/15 py-3 w-full">
									{getCtaLabel(program.productType, program.status)}
								</span>
							)}
							<p className="font-light text-dojo-white/30 text-[13px] text-center">
								La compra se procesa en Hotmart.
							</p>
						</div>
					</div>
				</motion.div>
			</section>

			{/* ── Picture break ── */}
			<BreakPicture />

			{/* ── Attributes ── */}
			<AttributesSection />

			{/* ── Visual break ── */}
			<DojoBreak />

			{/* ── CTA / Pricing (repeat) ── */}
			<section className="w-full bg-dark-blue text-dojo-white px-4 md:px-page py-12 md:py-24">
				<motion.div
					className="flex flex-col md:flex-row md:items-stretch border border-dojo-white/10"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-60px' }}
					transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				>
					{/* Left — title + subtitle */}
					<div className="flex-1 flex flex-col justify-between gap-8 p-8 md:p-16 border-b md:border-b-0 md:border-r border-dojo-white/10">
						<p className="font-medium text-dojo-white/40 text-[13px] uppercase tracking-[0.1em]">/{program.badge}</p>
						<div className="flex flex-col gap-4">
							<h2
								className="font-semibold text-dojo-white"
								style={{ fontSize: 'clamp(32px, 3.5vw, 60px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
							>
								{program.title}
							</h2>
							<p
								className="font-light text-dojo-white/60 flex items-center gap-2"
								style={{ fontSize: 'clamp(18px, 1.6vw, 26px)', letterSpacing: '-0.02em' }}
							>
								<IconArrowRight className="shrink-0" style={{ width: '0.9em', height: '0.9em' }} strokeWidth={1.5} />
								{program.subtitle}
							</p>
						</div>
						<div className="h-px bg-dojo-white/10" />
					</div>

					{/* Right — price + buttons */}
					<div className="w-full md:w-[480px] md:shrink-0 flex flex-col justify-between gap-8 p-8 md:p-16">
						<div className="flex flex-col gap-2">
							<p className="font-medium text-dojo-white/40 text-[13px] uppercase tracking-[0.1em]">Valor del Programa</p>
							{program.priceDisplay && (
								<p
									className="font-semibold text-dojo-white"
									style={{ fontSize: 'clamp(40px, 4vw, 72px)', letterSpacing: '-0.03em', lineHeight: 1 }}
								>
									{program.priceDisplay}
								</p>
							)}
						</div>

						<div className="flex flex-col gap-3">
							{program.status === 'available' ? (
								<Button
									href={program.hotmartCheckoutUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="w-full justify-center text-[16px]"
								>
									{getCtaLabel(program.productType, program.status)}
								</Button>
							) : (
								<span className="inline-flex items-center justify-center gap-4 font-medium text-[16px] tracking-[-0.02em] text-dojo-white/30 cursor-not-allowed border border-dojo-white/15 py-3 w-full">
									{getCtaLabel(program.productType, program.status)}
								</span>
							)}
							<p className="font-light text-dojo-white/30 text-[13px] text-center">
								La compra se procesa en Hotmart.
							</p>
						</div>
					</div>
				</motion.div>
			</section>
		</>
	)
}
