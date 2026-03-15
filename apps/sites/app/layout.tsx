import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SiteFlow',
  description: 'Serviço Gerenciado de Desenvolvimento de Sites para Negócios Locais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
