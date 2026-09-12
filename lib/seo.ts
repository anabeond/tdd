type FaqSource = {
  title: string
  level: string
  format: string
  duration: string
  status: string
}

function experienceAnswer(level: string, title: string): string {
  const normalized = level.toLowerCase()
  if (normalized.includes('avanzado') && !normalized.includes('inicial')) {
    return `Sí, ${title} es contenido avanzado: está pensado para quienes ya vienen practicando diseño y quieren profundizar, no para arrancar desde cero.`
  }
  if (normalized.includes('inicial') && normalized.includes('avanzado')) {
    return `No es excluyente. Podés arrancar sin experiencia previa y el contenido te acompaña hasta nivel avanzado.`
  }
  return `No, ${title} está pensado para arrancar sin experiencia previa.`
}

function formatAnswer(format: string): string {
  const normalized = format.toLowerCase()
  const hasLive = normalized.includes('en vivo')
  const hasRecorded = normalized.includes('grabado')
  if (hasLive && hasRecorded) {
    return 'Combina clases grabadas, a tu ritmo, con sesiones grupales en vivo para resolver dudas y ver proceso real.'
  }
  if (hasLive) return 'Es en vivo.'
  if (hasRecorded) return 'Es 100% grabado: lo hacés a tu ritmo, sin horarios fijos.'
  return format || 'Consultá el detalle de modalidad en la página del producto.'
}

function availabilityAnswer(status: string, title: string): string {
  if (status === 'available') return `Sí, ${title} está disponible ahora — podés anotarte desde esta misma página.`
  if (status === 'sold_out') return `Por ahora está agotado. Podés sumarte a la lista de espera para la próxima cohorte.`
  return `Todavía no — está en preparación. Podés dejar tu mail para que te avisemos apenas abra.`
}

export function buildProductFaq(
  product: FaqSource,
  priceDisplay: { amount: string; currency: 'USD' | 'ARS' } | null
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [
    { question: `¿Necesito experiencia previa para hacer ${product.title}?`, answer: experienceAnswer(product.level, product.title) },
    { question: '¿Es en vivo o grabado?', answer: formatAnswer(product.format) },
  ]

  if (product.duration) {
    faqs.push({ question: '¿Cuánto dura?', answer: `${product.duration}.` })
  }

  if (priceDisplay) {
    faqs.push({
      question: '¿En qué moneda pago?',
      answer: `El precio se muestra en ${priceDisplay.currency} (${priceDisplay.amount}).`,
    })
  }

  faqs.push({ question: `¿Está disponible ${product.title} ahora?`, answer: availabilityAnswer(product.status, product.title) })

  return faqs
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

export function breadcrumbJsonLd(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  }
}
