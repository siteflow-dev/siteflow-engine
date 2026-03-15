import { notFound } from 'next/navigation'
import { getClientConfig } from '@/lib/getClientConfig'

interface AgendarPageProps {
  params: { client: string }
}

/**
 * Página de agendamento.
 *
 * STATUS: Placeholder — Bloco 4
 * O componente BookingFlow da engine será integrado no Bloco 4.
 */
export default async function AgendarPage({ params }: AgendarPageProps) {
  const config = await getClientConfig(params.client)
  if (!config) notFound()

  if (!config.features.booking) notFound()

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: '#FEF9C3', border: '2px solid #CA8A04', borderRadius: '16px', padding: '2rem' }}>
        <h1 style={{ color: '#854D0E', marginBottom: '0.5rem' }}>
          ⏳ Agendamento — {config.businessName}
        </h1>
        <p style={{ color: '#92400E' }}>
          BookingFlow chega no <strong>Bloco 4</strong>.<br />
          Rota funcionando — componente em desenvolvimento.
        </p>
      </div>
    </main>
  )
}
