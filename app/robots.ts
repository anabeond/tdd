import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-config'

export default function robots(): MetadataRoute.Robots {
  if (process.env.COMING_SOON === 'true') {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: `${SITE_URL}/sitemap.xml`,
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
