import { notFound } from 'next/navigation'
import { getClientConfig } from '@/lib/getClientConfig'
import { getClientContent } from '@/lib/getClientContent'

interface ClientPageProps {
  params: { client: string }
}

/**
 * Página principal do cliente.
 *
 * STATUS: Placeholder — Bloco 1
 * Os componentes React da engine serão integrados no Bloco 2.
 * Por enquanto renderiza uma página de confirmação que tudo está funcionando.
 */
export default async function ClientPage({ params }: ClientPageProps) {
  const config = await getClientConfig(params.client)
  if (!config) notFound()

  const content = await getClientContent(params.client)

  return (
    <main style={{
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
    }}>

      {/* Confirmação visual — remover no Bloco 2 */}
      <div style={{
        background: '#F3E8FF',
        border: '2px solid #6B21A8',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <h1 style={{ color: '#6B21A8', fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>
          ✅ {config.businessName}
        </h1>
        <p style={{ color: '#374151', marginBottom: '1rem' }}>
          <strong>SiteFlow Engine v0.0.1 — Bloco 1 completo</strong><br />
          Rota dinâmica funcionando. Config carregado. Componentes React chegam no Bloco 2.
        </p>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1rem',
          fontSize: '0.875rem',
          color: '#6B7280',
        }}>
          <div><strong>Slug:</strong> {config.slug}</div>
          <div><strong>Segmento:</strong> {config.segment}</div>
          <div><strong>Variante CSS:</strong> {config.design.styleVariant}</div>
          <div><strong>Cor primária:</strong> {config.design.primaryColor}</div>
          <div><strong>Booking:</strong> {config.features.booking ? '✅ ativo' : '❌ inativo'}</div>
          <div><strong>Serviços carregados:</strong> {content.services.length}</div>
          <div><strong>Profissionais:</strong> {content.team.length}</div>
          <div><strong>Supabase:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ configurado' : '❌ falta .env'}</div>
          <div><strong>Sanity:</strong> {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? '✅ configurado' : '❌ falta .env'}</div>
        </div>
      </div>

      {/* Preview dos serviços — só para validar que o JSON carrega */}
      <h2 style={{ color: '#374151', marginBottom: '1rem' }}>
        Serviços ({content.services.length})
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {content.services.map((service) => (
          <div key={service.id} style={{
            background: 'white',
            border: '1px solid #E8DFF0',
            borderRadius: '12px',
            padding: '1rem',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{service.emoji}</div>
            <div style={{ fontWeight: '600', color: '#0D0D0D', fontSize: '0.9rem' }}>{service.name}</div>
            <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>{service.durationLabel}</div>
          </div>
        ))}
      </div>

    </main>
  )
}
