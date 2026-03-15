import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClientConfig, getAllClientSlugs } from '@/lib/getClientConfig'

interface ClientLayoutProps {
  children: React.ReactNode
  params: { client: string }
}

/**
 * Gera as rotas estáticas para todos os clientes ativos.
 * Adicionar slug em VALID_CLIENTS do getClientConfig para incluir.
 */
export async function generateStaticParams() {
  return getAllClientSlugs()
}

/**
 * Gera os metadados de SEO a partir do config.ts do cliente.
 */
export async function generateMetadata(
  { params }: { params: { client: string } }
): Promise<Metadata> {
  const config = await getClientConfig(params.client)
  if (!config) return { title: 'SiteFlow' }

  return {
    title:       config.seo.title,
    description: config.seo.description,
    keywords:    config.seo.keywords?.join(', '),
    openGraph: {
      title:       config.seo.title,
      description: config.seo.description,
      locale:      'pt_BR',
      type:        'website',
    },
  }
}

export default async function ClientLayout({ children, params }: ClientLayoutProps) {
  const config = await getClientConfig(params.client)

  if (!config) notFound()

  // Carrega as fontes do cliente dinamicamente
  const { displayFont, bodyFont } = config.design

  // Monta a URL do Google Fonts baseada nas fontes do config
  const googleFontsUrl = buildGoogleFontsUrl(displayFont, bodyFont)

  return (
    <>
      {/* Fontes do Google */}
      {googleFontsUrl && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href={googleFontsUrl} rel="stylesheet" />
        </>
      )}

      {/* CSS Custom Properties do cliente — injetado inline */}
      <style dangerouslySetInnerHTML={{
        __html: buildClientCssVars(config.design)
      }} />

      {/* Schema.org LocalBusiness — gerado do config */}
      {config.features.seoLocalBusiness && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildLocalBusinessSchema(config))
          }}
        />
      )}

      {children}
    </>
  )
}

/**
 * Monta a URL do Google Fonts para as fontes do cliente.
 */
function buildGoogleFontsUrl(displayFont: string, bodyFont: string): string {
  const fontsMap: Record<string, string> = {
    'Playfair Display': 'Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700',
    'DM Sans':          'DM+Sans:wght@300;400;500;600',
    'Inter':            'Inter:wght@300;400;500;600',
    'Montserrat':       'Montserrat:wght@300;400;500;600;700',
  }

  const fonts = [fontsMap[displayFont], fontsMap[bodyFont]]
    .filter(Boolean)
    .join('&family=')

  if (!fonts) return ''
  return `https://fonts.googleapis.com/css2?family=${fonts}&display=swap`
}

/**
 * Gera as CSS Custom Properties do cliente como string inline.
 * Sobrescreve os tokens base do design system com os valores do config.
 */
function buildClientCssVars(design: { primaryColor: string; accentColor: string; displayFont: string; bodyFont: string; borderRadius: string }): string {
  return `
    :root {
      --primary:       ${design.primaryColor};
      --accent:        ${design.accentColor};
      --font-display:  '${design.displayFont}', Georgia, serif;
      --font-body:     '${design.bodyFont}', system-ui, sans-serif;
      --radius:        ${design.borderRadius};
    }
  `
}

/**
 * Gera o Schema.org LocalBusiness a partir do config do cliente.
 */
function buildLocalBusinessSchema(config: Awaited<ReturnType<typeof getClientConfig>>) {
  if (!config) return {}

  return {
    '@context':   'https://schema.org',
    '@type':      'LocalBusiness',
    name:         config.businessName,
    description:  config.seo.description,
    url:          `https://${config.slug}.vercel.app`,
    telephone:    config.contact.whatsapp
      ? `+${config.contact.whatsapp}`
      : undefined,
    address: config.contact.address ? {
      '@type':          'PostalAddress',
      streetAddress:    config.contact.address,
      addressLocality:  config.contact.city,
      addressRegion:    config.contact.state,
      addressCountry:   'BR',
    } : undefined,
    sameAs: [
      config.contact.instagram
        ? `https://instagram.com/${config.contact.instagram.replace('@', '')}`
        : null,
    ].filter(Boolean),
  }
}
