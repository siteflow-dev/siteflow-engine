/**
 * SiteFlow Engine — Sanity Client
 *
 * Cada cliente tem seu proprio dataset no Sanity.
 * O dataset vem do config.ts do cliente: config.sanity.dataset
 *
 * IMPORTANTE: O projectId e compartilhado (1 organizacao Sanity).
 * O isolamento e pelo dataset — cada cliente ve apenas o seu conteudo.
 */

import { createClient } from '@sanity/client'
import type { BusinessInfo, Testimonial, GalleryItem } from '../types'

// ─── FACTORY ─────────────────────────────────────────────────────────────────

export function createSanityClient(dataset: string) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

  if (!projectId) {
    throw new Error(
      '[SiteFlow] NEXT_PUBLIC_SANITY_PROJECT_ID nao configurado no .env.local'
    )
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-03-01',
    useCdn: true,
  })
}

// ─── QUERIES GROQ ────────────────────────────────────────────────────────────

/**
 * Busca informacoes gerais do negocio.
 * Sobrescreve os fallbacks do config.ts quando disponivel no CMS.
 */
export async function getBusinessInfo(dataset: string): Promise<BusinessInfo | null> {
  const client = createSanityClient(dataset)
  const data = await client.fetch<BusinessInfo | null>(`
    *[_type == "businessInfo"][0] {
      headline,
      subheadline,
      about,
      stats[] {
        value,
        label,
        isReal
      },
      pillars[] {
        icon,
        title,
        description
      }
    }
  `)
  return data
}

/**
 * Busca depoimentos de clientes.
 */
export async function getTestimonials(dataset: string): Promise<Testimonial[]> {
  const client = createSanityClient(dataset)
  const data = await client.fetch<Testimonial[]>(`
    *[_type == "testimonial"] | order(_createdAt desc) {
      "id": _id,
      authorName,
      serviceName,
      text,
      stars,
      "photoUrl": photo.asset->url,
      isReal
    }
  `)
  return data ?? []
}

/**
 * Busca itens da galeria agrupados por categoria.
 */
export async function getGalleryItems(dataset: string): Promise<GalleryItem[]> {
  const client = createSanityClient(dataset)
  const data = await client.fetch<GalleryItem[]>(`
    *[_type == "galleryImage"] | order(category asc) {
      "id": _id,
      category,
      "imageUrl": image.asset->url,
      label,
      caption
    }
  `)
  return data ?? []
}
