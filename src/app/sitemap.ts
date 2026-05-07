import { MetadataRoute } from 'next'
import { query } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/order`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/support`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const services = await query<{ brand: string; carrier: string }>(
    `SELECT DISTINCT brand, carrier FROM services WHERE active = TRUE`
  ).catch(() => [])

  const dynamicPages: MetadataRoute.Sitemap = services.map(s => ({
    url: `${BASE}/unlock/${s.brand}/${s.carrier}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...dynamicPages]
}
