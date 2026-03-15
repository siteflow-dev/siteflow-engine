/**
 * SiteFlow Engine — Guia de Responsividade
 *
 * Leia este arquivo antes de criar qualquer componente.
 * Seguir estas regras garante consistencia visual em todos os dispositivos
 * sem retrabalho apos o desenvolvimento.
 *
 * ─── ESTRATEGIA: MOBILE-FIRST ──────────────────────────────────────────
 *
 * Escrevemos o CSS para mobile primeiro, depois adicionamos breakpoints
 * para telas maiores. No Tailwind isso significa:
 *
 *   Errado:  className="grid-cols-3 sm:grid-cols-1"
 *   Correto: className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
 *
 * ─── BREAKPOINTS (Tailwind) ────────────────────────────────────────────
 *
 *   xs  (personalizado): 480px  — telefones grandes
 *   sm  (default):       640px  — nao usar como "mobile" — e transicao
 *   md  (default):       768px  — tablet e acima
 *   lg  (default):       1024px — notebook
 *   xl  (default):       1280px — desktop
 *   2xl (default):       1536px — monitor grande
 *
 * ─── REGRAS POR COMPONENTE ────────────────────────────────────────────
 *
 * NAVBAR:
 *   - Mobile: hamburger menu, links escondidos
 *   - >= md: links visiveis, hamburguer escondido
 *   - Altura: 64px mobile / 72px desktop (var --nav-height)
 *   - Menu aberto em mobile: posicao fixed, z-index: 1000
 *
 * HERO:
 *   - Mobile: 1 coluna, centralizado, sem visual decorativo
 *   - >= 900px: 2 colunas, texto alinhado esquerda, visual visivel
 *   - Titulo: clamp(2.5rem, 8vw, 5.5rem) — nunca fixo
 *   - min-height: 100svh (svh correto no iOS Safari)
 *
 * BOOKING FLOW:
 *   - Step indicator: sem labels em mobile (so numeros), labels em >= md
 *   - Grid de servicos: 1 coluna mobile, 2 colunas >= 480px
 *   - Grid de profissionais: 2 colunas mobile, 3 colunas >= 480px
 *   - Grid de horarios: 3 colunas mobile, 4 >= 480px, 5 >= md
 *   - Botoes de navegacao: largura total em mobile
 *   - Painel: padding 1.5rem mobile, 2rem >= 480px, 2.5rem >= md
 *
 * PROFESSIONAL PANEL:
 *   - Tabs: overflow-x: auto com scroll horizontal suave
 *   - Cards de agendamento: empilhar acoes em mobile
 *   - Stats grid: 2x2 mobile, 4x1 desktop
 *   - Timeline: coluna de horario menor em mobile (50px vs 60px)
 *
 * SERVICES GRID:
 *   - 1 coluna mobile, auto-fill minmax(280px) tablet+
 *   - Cards com padding menor em mobile (1.25rem vs 2rem)
 *
 * TEAM GRID:
 *   - 1 coluna mobile, 2 >= 480px, 3 >= md
 *
 * GALLERY:
 *   - Mobile: 2 colunas, sem spans especiais
 *   - >= md: 3 colunas com spans decorativos (item 1 span 2, item 4 span 2)
 *
 * TESTIMONIALS:
 *   - 1 coluna mobile, 3 colunas >= md
 *
 * CONTACT:
 *   - 1 coluna mobile, 2 colunas >= md
 *
 * FAB:
 *   - bottom: 1.5rem mobile (acima do indicador de home do iOS)
 *   - bottom: 2rem desktop
 *
 * TOAST:
 *   - bottom: 5rem mobile (acima do FAB)
 *   - bottom: 2rem desktop
 *   - max-width: calc(100vw - 40px) para nao vazar em mobile
 *
 * ─── CHECKLIST DE TESTE ────────────────────────────────────────────────
 *
 * Antes de marcar qualquer componente como concluido, verificar em:
 *
 *   [ ] iPhone SE (375px) — menor tela mais comum
 *   [ ] iPhone 14 Pro (393px)
 *   [ ] Samsung Galaxy A (360px)
 *   [ ] iPad (768px) — portrait
 *   [ ] iPad (1024px) — landscape
 *   [ ] MacBook 13" (1280px)
 *   [ ] Desktop (1440px+)
 *
 * Ferramentas:
 *   - Chrome DevTools (F12 > Toggle Device Toolbar)
 *   - Safari Responsive Design Mode (Develop > Responsive Design Mode)
 *
 * O que verificar em cada breakpoint:
 *   [ ] Nenhum scroll horizontal
 *   [ ] Textos legiveis (min 14px)
 *   [ ] Botoes e inputs com altura minima 44px
 *   [ ] Navegacao funcionando (hamburguer em mobile)
 *   [ ] Fluxo de agendamento completo usavel por toque
 *   [ ] Painel da profissional usavel em tablet
 *   [ ] FAB nao cobre conteudo importante
 *   [ ] Inputs nao causam zoom no iOS (font-size >= 16px)
 *
 * ─── PROBLEMAS COMUNS E SOLUCOES ──────────────────────────────────────
 *
 * Zoom em inputs iOS:
 *   Causa: font-size < 16px em inputs
 *   Solucao: sempre font-size: 1rem (16px) em inputs, nunca menor
 *
 * 100vh incorreto no iOS Safari:
 *   Causa: barra de endereco do Safari muda a altura do viewport
 *   Solucao: usar 100svh para secoes full-screen (hero)
 *
 * Tap highlight indesejado:
 *   Causa: comportamento padrao do webkit
 *   Solucao: -webkit-tap-highlight-color: transparent em botoes/links
 *
 * Overflow horizontal misterioso:
 *   Causa: elemento mais largo que o viewport
 *   Solucao: body { overflow-x: hidden } + inspecionar com borda vermelha
 *
 * Fixed elements em iOS:
 *   Causa: comportamento de scroll diferente no iOS
 *   Solucao: testar navbar e FAB especificamente no iPhone
 */

export const BREAKPOINTS = {
  xs:  480,
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  xxl: 1536,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

/** Verifica se estamos em mobile (client-side apenas) */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < BREAKPOINTS.md
}

/** Media query string para uso em CSS-in-JS se necessario */
export function mq(bp: Breakpoint): string {
  return `@media (min-width: ${BREAKPOINTS[bp]}px)`
}
