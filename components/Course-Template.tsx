'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { PRODUCT_TYPE_LABELS, getCtaLabel } from '@/lib/productType'
import type { ProductStatus, ProductType } from '@/lib/products'

export type CourseModule = {
	title: string
	description: string
}

export type CourseTemplateData = {
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
	modules: CourseModule[]
	ctaLabel: string
	productType: ProductType
	status: ProductStatus
}

type CourseTemplateProps = {
	course: CourseTemplateData
}

export default function CourseTemplate({ course }: CourseTemplateProps) {
	return (
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
								/{course.badge}
							</p>
							<Tag label={PRODUCT_TYPE_LABELS[course.productType]} />
						</div>
						<h1
							className="font-semibold"
							style={{ fontSize: 'clamp(40px, 6vw, 92px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}
						>
							{course.title}
						</h1>
						<p
							className="text-dojo-white/85"
							style={{ fontSize: 'clamp(20px, 2vw, 30px)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
						>
							{course.subtitle}
						</p>
					</div>

					<div className="grid grid-cols-3 gap-4 border border-dojo-white/20 p-4">
						<div className="flex flex-col gap-1">
							<span className="text-dojo-white/60 text-[11px] uppercase tracking-[1.5px]">Duracion</span>
							<span className="text-[16px] font-semibold">{course.duration}</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-dojo-white/60 text-[11px] uppercase tracking-[1.5px]">Nivel</span>
							<span className="text-[16px] font-semibold">{course.level}</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-dojo-white/60 text-[11px] uppercase tracking-[1.5px]">Formato</span>
							<span className="text-[16px] font-semibold">{course.format}</span>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
					className="relative w-full overflow-hidden"
					style={{ aspectRatio: '16 / 8' }}
				>
					<img src={course.heroImage} alt={course.title} className="w-full h-full object-cover" />
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
						<img src="/images/STICKER.png" alt="" width={150} height={150} />
						<h2 className="font-semibold text-[34px] tracking-[-0.02em]">Overview</h2>
						<p className="text-dojo-white/85 text-[18px] leading-[1.55]">{course.overview}</p>
						<ul className="flex flex-col gap-2">
							{course.outcomes.map((outcome) => (
								<li key={outcome} className="text-dojo-white text-[16px] leading-[1.45]">
									{'• '} {outcome}
								</li>
							))}
						</ul>

						{course.targetAudience.length > 0 && (
							<div className="flex flex-col gap-3 mt-10">
								<h2 className="font-semibold text-[24px] tracking-[-0.02em]">A quién va dirigido</h2>
								<ul className="flex flex-col gap-2">
									{course.targetAudience.map((item) => (
										<li key={item} className="text-dojo-white text-[16px] leading-[1.45]">
											{'• '} {item}
										</li>
									))}
								</ul>
							</div>
						)}

						{course.notFor.length > 0 && (
							<div className="flex flex-col gap-3 mt-10">
								<h2 className="font-semibold text-[24px] tracking-[-0.02em]">Para quién no es</h2>
								<ul className="flex flex-col gap-2">
									{course.notFor.map((item) => (
										<li key={item} className="text-dojo-white/60 text-[16px] leading-[1.45]">
											{'• '} {item}
										</li>
									))}
								</ul>
							</div>
						)}

						<div className="flex items-center gap-4 pt-2">
							{course.priceUsd && (
								<div className="flex flex-col gap-1 text-[18px] font-medium">
									<span className="text-dojo-white/70">{course.priceUsd}</span>
									{course.priceArs && (
										<span className="text-dojo-white/40" style={{ fontSize: '0.6em' }}>
											{course.priceArs}
										</span>
									)}
								</div>
							)}
							{course.status === 'available' ? (
								<Button
									href={course.hotmartCheckoutUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-[16px]"
								>
									{getCtaLabel(course.productType, course.status)}
								</Button>
							) : (
								<span className="inline-flex items-center gap-4 font-medium text-[24px] tracking-[-0.02em] text-dojo-white/30 cursor-not-allowed">
									{getCtaLabel(course.productType, course.status)}
								</span>
							)}
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<h2 className="font-semibold text-[34px] tracking-[-0.02em]">Módulos</h2>
						<div className="flex flex-col border border-dojo-white/20">
							{course.modules.map((module, index) => (
								<div
									key={module.title}
									className="p-5 border-b border-dojo-white/15 last:border-b-0"
								>
									<p className="text-dojo-white/60 text-[12px] uppercase tracking-[1.4px]">Módulo {index + 1}</p>
									<h3 className="font-semibold text-[22px] tracking-[-0.02em] mt-1">{module.title}</h3>
									<p className="text-dojo-white/82 text-[15px] leading-[1.5] mt-2">{module.description}</p>
								</div>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
