export default function NotFound() {
  return (
    <main style={{
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</div>
      <h1 style={{ color: '#374151', marginBottom: '0.5rem' }}>Página não encontrada</h1>
      <p style={{ color: '#6B7280' }}>O cliente ou página que você buscou não existe.</p>
    </main>
  )
}
