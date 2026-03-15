/**
 * SiteFlow — getClientConfig
 *
 * Carrega o config.ts do cliente pelo slug.
 * Usado no layout e nas pages de cada cliente.
 *
 * COMO FUNCIONA:
 *   URL: divashair.vercel.app/divas-hair → slug = 'divas-hair'
 *   → importa clients/divas-hair/config.ts
 *   → retorna SiteFlowClientConfig tipado
 *
 * ADICIONAR NOVO CLIENTE:
 *   1. Criar clients/[slug]/config.ts
 *   2. Adicionar o slug no array VALID_CLIENTS abaixo
 *   Pronto — o site já funciona na rota /[slug]
 */

import type { SiteFlowClientConfig } from '@siteflow/engine/types'

/**
 * Lista de clientes ativos.
 * Adicionar o slug aqui ao criar um novo cliente.
 * Isso previne que slugs inválidos tentem importar configs inexistentes.
 */
export const VALID_CLIENTS = [
  'divas-hair',
  // 'barberpro',     ← descomentar quando o cliente for criado
  // 'clinicare',
] as const

export type ClientSlug = typeof VALID_CLIENTS[number]

/**
 * Verifica se um slug é um cliente válido
 */
export function isValidClient(slug: string): slug is ClientSlug {
  return VALID_CLIENTS.includes(slug as ClientSlug)
}

/**
 * Carrega e retorna o config.ts de um cliente pelo slug.
 * Retorna null se o cliente não existir.
 */
export async function getClientConfig(
  slug: string
): Promise<SiteFlowClientConfig | null> {
  if (!isValidClient(slug)) return null

  try {
    const mod = await import(`../../../clients/${slug}/config`)
    return mod.default as SiteFlowClientConfig
  } catch (error) {
    console.error(`[SiteFlow] Erro ao carregar config do cliente "${slug}":`, error)
    return null
  }
}

/**
 * Versão síncrona — para uso em generateStaticParams
 * Retorna todos os slugs de clientes válidos
 */
export function getAllClientSlugs(): Array<{ client: string }> {
  return VALID_CLIENTS.map(slug => ({ client: slug }))
}
