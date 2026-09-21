'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import DojoBreak from '@/components/DojoBreak'
import BreakPicture from '@/components/BreakPicture'
import AttributesSection from '@/components/AttributesSection'
import InterestForm from '@/components/InterestForm'
import { IconArrowRight, IconBrandDiscord } from '@tabler/icons-react'
import { getCtaLabel } from '@/lib/productType'
import type { ProductStatus, ProductType } from '@/lib/products'

export type ProgramModule = {
	title: string
	description: string
	lessons?: number
}

export type ProgramTemplateData = {
	slug: string
	badge: string
	title: string
	subtitle: string
	overview: string
	heroImage: string
	heroImageMobile: string
	duration: string
	level: string
	format: string
	priceUsd: string
	priceArs: string
	hotmartCheckoutUrl: string
	outcomes: string[]
	targetAudience: string[]
	notFor: string[]
	modules: ProgramModule[]
	ctaLabel: string
	featured?: boolean
	highlightTags?: { icon: string; label: string }[]
	productType: ProductType
	status: ProductStatus
	/** Fecha visible del lanzamiento mientras status === 'pre_launch' */
	prelaunchLabel: string
}

type ProgramTemplateProps = {
	program: ProgramTemplateData
}

function PriceDisplay({ priceArs }: { priceArs: string }) {
	return <span className="text-dojo-white">{priceArs}</span>
}

function CtaAside({ program }: { program: ProgramTemplateData }) {
	// Pre-lanzamiento: sin precio ni checkout — fecha + form de interés.
	if (program.status === 'pre_launch') {
		return (
			<div className="w-full md:w-[480px] md:shrink-0 flex flex-col justify-between gap-8 p-8 md:p-16">
				<div className="flex flex-col gap-2">
					<p className="font-medium text-accent text-[13px] uppercase tracking-[0.1em]">Lanzamiento Oficial</p>
					{program.prelaunchLabel && (
						<div
							className="font-semibold"
							style={{ fontSize: 'clamp(22px, 2.2vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
						>
							{program.prelaunchLabel}
						</div>
					)}
					<p className="font-light text-dojo-white/50" style={{ fontSize: 15, lineHeight: 1.5 }}>
						Dejanos tu nombre y tu mail y te avisamos apenas abra la inscripción.
					</p>
				</div>

				<InterestForm productSlug={program.slug} />
			</div>
		)
	}

	return (
		<div className="w-full md:w-[480px] md:shrink-0 flex flex-col justify-between gap-8 p-8 md:p-16">
			<div className="flex flex-col gap-2">
				<p className="font-medium text-accent text-[13px] uppercase tracking-[0.1em]">Valor del Programa</p>
				{program.priceArs && (
					<div
						className="font-semibold"
						style={{ fontSize: 'clamp(22px, 2.2vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1 }}
					>
						<PriceDisplay priceArs={program.priceArs} />
					</div>
				)}
			</div>

			<div className="flex flex-col gap-3">
				{program.status === 'available' ? (
					<Button
						href={program.hotmartCheckoutUrl}
						target="_blank"
						rel="noopener noreferrer"
						variant="underline"
						className="self-start text-[22px] text-dojo-white border-accent border-b-2 hover:text-accent"
					>
						{getCtaLabel(program.productType, program.status)}
						<IconArrowRight size="1em" strokeWidth={2} className="inline-block" />
					</Button>
				) : (
					<span className="inline-flex items-center justify-center gap-4 font-medium text-[16px] tracking-[-0.02em] text-dojo-white/30 cursor-not-allowed border border-dojo-white/15 py-3 w-full">
						{getCtaLabel(program.productType, program.status)}
					</span>
				)}
			</div>
		</div>
	)
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
						className="flex flex-col gap-5"
					>
						<p
							className="font-semibold text-dojo-white/75 uppercase"
							style={{ fontSize: 13, letterSpacing: '0.08em' }}
						>
							/{program.badge}
						</p>
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
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
						className="relative w-full overflow-hidden"
						style={{ aspectRatio: '16 / 8' }}
					>
						<img src={program.heroImage} alt={program.title} className="w-full h-full object-cover" />
						<div className="absolute inset-0 bg-gradient-to-r from-dark-blue/45 via-dark-blue/10 to-transparent pointer-events-none" />
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
						className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border border-dojo-white/20 p-4"
					>
						<div className="flex flex-wrap items-center gap-8">
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

						{/* Discord — common to every program */}
						<div className="flex items-center gap-2">
							<IconBrandDiscord size={24} className="text-dojo-white/60 shrink-0" strokeWidth={1.5} />
							<span className="text-dojo-white/60 text-[13px] leading-[1.3]">
								Canal privado en Discord
							</span>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-100px' }}
						transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
						className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12"
					>
						<div className="flex flex-col gap-10">
							{/* Qué vas a aprender — sticker + title span full width, copy flows as balanced 2-column text below it */}
							<div className="flex flex-col gap-5">
								<img src="/images/STICKER.png" alt="" width={150} height={150} />
								<h2 className="font-semibold text-[34px] tracking-[-0.02em]">Qué vas a aprender</h2>
								<div className="sm:columns-2 sm:gap-8 [column-fill:balance]">
									<p className="font-semibold text-[22px] tracking-[-0.02em] leading-[1.25] pb-5 break-inside-avoid">
										{program.overview}
									</p>
									<ul className="mt-2">
										{program.outcomes.map((outcome) => (
											<li
												key={outcome}
												className="text-dojo-white text-[16px] leading-[1.45] mt-2 break-inside-avoid"
											>
												{'• '} {outcome}
											</li>
										))}
									</ul>
								</div>
							</div>

							{/* A quién va dirigido / Para quién no es — side by side */}
							{(program.targetAudience.length > 0 || program.notFor.length > 0) && (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
									{program.targetAudience.length > 0 && (
										<div className="flex flex-col gap-3">
											<h2 className="font-semibold text-[24px] tracking-[-0.02em]">A quién va dirigido</h2>
											<ul className="flex flex-col gap-2">
												{program.targetAudience.map((item) => (
													<li key={item} className="text-dojo-white text-[16px] leading-[1.45]">
														{'• '} {item}
													</li>
												))}
											</ul>
										</div>
									)}

									{program.notFor.length > 0 && (
										<div className="flex flex-col gap-3">
											<h2 className="font-semibold text-[24px] tracking-[-0.02em]">Para quién no es</h2>
											<ul className="flex flex-col gap-2">
												{program.notFor.map((item) => (
													<li key={item} className="text-dojo-white/60 text-[16px] leading-[1.45]">
														{'• '} {item}
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							)}
						</div>

						<div className="flex flex-col gap-4">
							<h2 className="font-semibold text-[34px] tracking-[-0.02em]">Módulos</h2>
							<div className="flex flex-col border border-dojo-white/20">
								{program.modules.map((module, index) => (
									<div
										key={module.title}
										className="p-5 border-b border-dojo-white/15 last:border-b-0"
									>
										<div className="flex items-center justify-between gap-4">
											<p className="text-dojo-white/60 text-[12px] uppercase tracking-[1.4px]">Módulo {index + 1}</p>
											{typeof module.lessons === 'number' && (
												<p className="text-dojo-white/60 text-[12px] uppercase tracking-[1.4px]">
													{module.lessons} {module.lessons === 1 ? 'clase' : 'clases'}
												</p>
											)}
										</div>
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
						<p className="font-medium text-accent text-[13px] uppercase tracking-[0.1em]">/{program.badge}</p>
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
					</div>

					{/* Right — price + buttons, o fecha de lanzamiento + form si todavía no abrió */}
					<CtaAside program={program} />
				</motion.div>
			</section>

			{/* ── Picture break ── */}
			<BreakPicture
				src={program.heroImage}
				srcMobile={program.heroImageMobile}
				fit="contain"
				overlay={false}
			/>

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
						<p className="font-medium text-accent text-[13px] uppercase tracking-[0.1em]">/{program.badge}</p>
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
					</div>

					{/* Right — price + buttons, o fecha de lanzamiento + form si todavía no abrió */}
					<CtaAside program={program} />
				</motion.div>
			</section>
		</>
	)
}
