import { getProductCards } from '@/lib/products'
import { SITE_URL, SITE_NAME, SOCIAL_LINKS } from '@/lib/site-config'

const STATUS_LABEL: Record<string, string> = {
  available: 'disponible',
  coming_soon: 'próximamente',
  sold_out: 'agotado',
}

export async function GET() {
  const products = await getProductCards()

  const comingSoon = process.env.COMING_SOON === 'true'
  const preLaunchNote = comingSoon
    ? '\n> Nota: el sitio público todavía muestra una pantalla "coming soon" — el catálogo de abajo es el contenido real, en preparación para el lanzamiento.\n'
    : ''

  const productLines = products
    .map((p) => `- [${p.title}](${SITE_URL}${p.href}): ${p.subtitle || p.meta || ''} — ${STATUS_LABEL[p.status] ?? p.status}`)
    .join('\n')

  const body = `# ${SITE_NAME}

> Escuela de diseño UX/UI en español para diseñadores latinoamericanos, fundada por Ana B. Wilhelm. Aprendizaje en vivo con proceso real de diseño, no solo teoría — canal insignia en Twitch todos los lunes a las 19:00 hs (ART).
${preLaunchNote}
## Sobre

- [Quiénes somos](${SITE_URL}/the-dojo): fundadora, comunidad y enfoque pedagógico del dojo.
- [Enfoque con IA](${SITE_URL}/ai-approach): cómo se integra la IA en el proceso de diseño sin reemplazar el criterio del diseñador.

## Programas y cursos

${productLines || '- Catálogo en preparación.'}

## Comunidad

- [Twitch](${SOCIAL_LINKS.twitch}): streams de diseño UX/UI en vivo, lunes 19:00 hs (ART).
- [Instagram](${SOCIAL_LINKS.instagram})
- [Figma Community](${SOCIAL_LINKS.figma})
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
