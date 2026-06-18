'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

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
	duration: string
	level: string
	format: string
	price: number
	thinkificUrl: string
	outcomes: string[]
	modules: CourseModule[]
	ctaLabel: string
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
						<p
							className="font-semibold text-dojo-white/75 uppercase"
							style={{ fontSize: 13, letterSpacing: '0.08em' }}
						>
							/{course.badge}
						</p>
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
						<h2 className="font-semibold text-[34px] tracking-[-0.02em]">Overview</h2>
						<p className="text-dojo-white/85 text-[18px] leading-[1.55]">{course.overview}</p>
						<ul className="flex flex-col gap-2">
							{course.outcomes.map((outcome) => (
								<li key={outcome} className="text-dojo-white text-[16px] leading-[1.45]">
									{'-> '} {outcome}
								</li>
							))}
						</ul>
						<div className="pt-2">
							<Button href={`/checkout/${course.slug}`} className="text-[16px]">
								{course.ctaLabel}
							</Button>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<h2 className="font-semibold text-[34px] tracking-[-0.02em]">Modulos</h2>
						<div className="flex flex-col border border-dojo-white/20">
							{course.modules.map((module, index) => (
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
	)
}
