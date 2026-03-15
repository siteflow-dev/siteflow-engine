/**
 * SiteFlow — getClientContent
 *
 * Carrega os arquivos JSON de conteúdo de um cliente.
 * Fonte primária: clients/[slug]/content/*.json
 * Fonte secundária (futura): Sanity CMS via GROQ
 */

import type {
  Service,
  Professional,
  Testimonial,
  GalleryItem,
  BusinessInfo,
} from '@siteflow/engine/types'

export interface ClientContent {
  services:     Service[]
  team:         Professional[]
  testimonials: Testimonial[]
  gallery:      GalleryItem[]
  business:     BusinessInfo
}

/**
 * Carrega todo o conteúdo estático de um cliente.
 * Em produção com Sanity configurado, sobrescrever com dados do CMS.
 */
export async function getClientContent(slug: string): Promise<ClientContent> {
  const [services, team, testimonials, gallery, business] = await Promise.all([
    import(`../../../clients/${slug}/content/services.json`).then(m => m.default),
    import(`../../../clients/${slug}/content/team.json`).then(m => m.default),
    import(`../../../clients/${slug}/content/testimonials.json`).then(m => m.default),
    import(`../../../clients/${slug}/content/gallery.json`).then(m => m.default),
    import(`../../../clients/${slug}/content/business.json`).then(m => m.default),
  ])

  return { services, team, testimonials, gallery, business }
}
