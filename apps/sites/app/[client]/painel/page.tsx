import { notFound } from 'next/navigation'
import { getClientConfig } from '@/lib/getClientConfig'

interface PainelPageProps {
  params: { client: string }
}

/**
 * Página do painel da profissional.
 *
 * STATUS: Placeholder — Bloco 5
 * O componente ProfessionalPanel da engine será integrado no Bloco 5.
 */
export default async function PainelPage({ params }: PainelPageProps) {
  const config = await getClientConfig(params.client)
  if (!config) notFound()

  if (!config.features.professionalPanel) notFound()

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: '#FEF9C3', border: '2px solid #CA8A04', borderRadius: '16px', padding: '2rem' }}>
        <h1 style={{ color: '#854D0E', marginBottom: '0.5rem' }}>
          ⏳ Painel — {config.businessName}
        </h1>
        <p style={{ color: '#92400E' }}>
          ProfessionalPanel chega no <strong>Bloco 5</strong>.<br />
          Rota funcionando — componente em desenvolvimento.
        </p>
      </div>
    </main>
  )
}
