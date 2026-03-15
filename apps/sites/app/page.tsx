import { redirect } from 'next/navigation'

/**
 * Página raiz — redireciona para o cliente demo em produção.
 * Em desenvolvimento, mostra lista de clientes disponíveis.
 */
export default function RootPage() {
  // Em produção: redirecionar para o cliente configurado
  // Por enquanto redireciona para o demo
  redirect('/divas-hair')
}
