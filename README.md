# SiteFlow Monorepo

Servico Gerenciado de Desenvolvimento de Sites para Negocios Locais.

## Estrutura

```
siteflow/
├── apps/
│   ├── sites/          # Next.js app que serve todos os clientes
│   └── admin/          # [RESERVADO] Painel interno SiteFlow
├── packages/
│   ├── engine/         # Componentes React compartilhados
│   └── design-system/  # Tokens CSS e variantes visuais
├── clients/
│   └── divas-hair/     # Template modelo — primeiro cliente
└── supabase/           # SQL migrations e seeds
```

## Requisitos

- Node.js 20+
- pnpm 9+

## Instalacao

```bash
pnpm install
```

## Desenvolvimento

```bash
# Rodar todos os apps
pnpm dev

# Rodar apenas o sites app
pnpm dev --filter=@siteflow/sites

# Build completo
pnpm build

# Lint
pnpm lint
```

## Adicionar novo cliente

1. Criar pasta `clients/[slug]/`
2. Copiar estrutura de `clients/divas-hair/` como base
3. Editar `clients/[slug]/config.ts` com dados do cliente
4. Popular `clients/[slug]/content/` com JSON do cliente
5. Criar dataset no Sanity: `[slug]`
6. Criar registros no Supabase com `client_id = '[slug]'`
7. Configurar projeto na Vercel

## Documentacao

Cada cliente tem um documento oficial em:
`doc-[slug]-v[versao]-[AAAAMM].docx`

## Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **CMS:** Sanity.io (1 dataset por cliente)
- **Banco:** Supabase PostgreSQL (RLS por client_id)
- **Deploy:** Vercel + Cloudflare CDN
- **CI/CD:** GitHub Actions + Vercel Webhooks
- **Monorepo:** Turborepo

---

*SiteFlow — Versao 0.0.1 — Marco 2026*
