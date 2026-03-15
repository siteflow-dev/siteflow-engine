# Painel Administrativo SiteFlow

> **Status:** Reservado — desenvolvimento previsto para Fase 2

Esta pasta conterá o Painel Administrativo interno do SiteFlow.

## Escopo previsto (Fase 2 — Sprint 15-16)

- Gestão de clientes (lista, ficha, histórico)
- Pipeline Kanban de produção
- Controle financeiro e inadimplência
- Módulo de representantes comerciais
- Métricas e relatórios (MRR, churn, NPS)

## Arquitetura

- Framework: Next.js 14 (App Router) — mesma stack da engine
- Auth: Supabase Auth com perfis Admin / Operacional / Representante
- Banco: Schema separado no mesmo projeto Supabase
- Deploy: Vercel, projeto independente — URL: admin.siteflow.com.br
- Compartilha: apenas `@siteflow/design-system` com a engine

## Referência

Ver Seção 11 da documentação do produto SiteFlow (siteflow-documentacao-v7.docx)
