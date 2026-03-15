-- ════════════════════════════════════════════════════════════════════════
-- SiteFlow — Migration 001: Schema Inicial
-- Versao: 0.0.1 | Marco 2026
--
-- ESTRATEGIA DE ISOLAMENTO:
--   1 projeto Supabase, N clientes.
--   Isolamento garantido por Row Level Security (RLS) em todas as tabelas.
--   O client_id no JWT claim e a chave que filtra os dados automaticamente.
--
-- COMO EXECUTAR:
--   1. Criar projeto no Supabase (supabase.com)
--   2. Ir em SQL Editor
--   3. Colar e executar este arquivo
--   4. Em seguida executar: supabase/seed/divas-hair.sql
-- ════════════════════════════════════════════════════════════════════════

-- ── EXTENSOES ────────────────────────────────────────────────────────────
-- Necessario para gen_random_uuid() em versoes antigas do PostgreSQL
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── TABELA: services ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id     TEXT NOT NULL,
  slug          TEXT NOT NULL,
  name          TEXT NOT NULL,
  emoji         TEXT,
  duration_min  INTEGER NOT NULL CHECK (duration_min > 0),
  duration_label TEXT NOT NULL,
  description   TEXT,
  price_from    DECIMAL(10,2),
  active        BOOLEAN DEFAULT true NOT NULL,
  sort_order    INTEGER DEFAULT 0 NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,

  CONSTRAINT services_client_slug_unique UNIQUE (client_id, slug)
);

COMMENT ON TABLE services IS 'Catalogo de servicos por cliente. Isolado por client_id via RLS.';

-- ── TABELA: professionals ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS professionals (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id        TEXT NOT NULL,
  slug             TEXT NOT NULL,
  name             TEXT NOT NULL,
  initials         VARCHAR(2) NOT NULL,
  role             TEXT,
  specialties      TEXT[] DEFAULT '{}' NOT NULL,
  accepts_booking  BOOLEAN DEFAULT true NOT NULL,
  active           BOOLEAN DEFAULT true NOT NULL,

  CONSTRAINT professionals_client_slug_unique UNIQUE (client_id, slug)
);

COMMENT ON TABLE professionals IS 'Profissionais do salao por cliente. Isolado por client_id via RLS.';

-- ── TABELA: appointments ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id       TEXT NOT NULL,
  client_name     TEXT NOT NULL,
  client_phone    TEXT NOT NULL,
  service_id      UUID REFERENCES services(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
  date            DATE NOT NULL,
  time            TIME NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes           TEXT,
  source          TEXT NOT NULL DEFAULT 'website'
                  CHECK (source IN ('website', 'admin', 'whatsapp')),
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE appointments IS 'Agendamentos dos clientes. Isolado por client_id via RLS. INSERT publico, leitura/atualizacao apenas para profissionais autenticadas do mesmo cliente.';

-- ── TRIGGER: updated_at automatico em appointments ───────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ── TABELA: professional_sessions ────────────────────────────────────────
-- Vincula um usuario do Supabase Auth a uma profissional especifica
CREATE TABLE IF NOT EXISTS professional_sessions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id       TEXT NOT NULL,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  auth_user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  active          BOOLEAN DEFAULT true NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,

  CONSTRAINT sessions_user_unique UNIQUE (auth_user_id)
);

COMMENT ON TABLE professional_sessions IS 'Vinculo entre auth.users (Supabase Auth) e profissionais. O JWT gerado inclui claim client_id usado pelo RLS.';

-- ════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════════════

-- Habilitar RLS
ALTER TABLE services              ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_sessions ENABLE ROW LEVEL SECURITY;

-- ── POLICIES: services ───────────────────────────────────────────────────

-- Leitura publica: o site precisa listar servicos sem autenticacao
CREATE POLICY "services_public_read" ON services
  FOR SELECT USING (true);

-- Escrita: apenas service_role (admin interno) pode criar/editar servicos
-- No dia-a-dia isso e feito via Sanity CMS ou pelo painel admin
CREATE POLICY "services_service_role_write" ON services
  FOR ALL USING (auth.role() = 'service_role');

-- ── POLICIES: professionals ──────────────────────────────────────────────

-- Leitura publica: o site precisa exibir a equipe
CREATE POLICY "professionals_public_read" ON professionals
  FOR SELECT USING (true);

-- Escrita: apenas service_role
CREATE POLICY "professionals_service_role_write" ON professionals
  FOR ALL USING (auth.role() = 'service_role');

-- ── POLICIES: appointments ───────────────────────────────────────────────

-- INSERT publico: qualquer visitante pode agendar (sem login)
CREATE POLICY "appointments_public_insert" ON appointments
  FOR INSERT WITH CHECK (true);

-- SELECT: profissional autenticada ve apenas agendamentos do seu cliente
-- O claim 'client_id' e injetado no JWT via Auth Hook no Supabase
CREATE POLICY "appointments_professional_read" ON appointments
  FOR SELECT USING (
    auth.role() = 'service_role'
    OR
    client_id = (auth.jwt() ->> 'client_id')
  );

-- UPDATE: profissional autenticada atualiza apenas agendamentos do seu cliente
CREATE POLICY "appointments_professional_update" ON appointments
  FOR UPDATE USING (
    auth.role() = 'service_role'
    OR
    client_id = (auth.jwt() ->> 'client_id')
  );

-- ── POLICIES: professional_sessions ─────────────────────────────────────

-- Apenas service_role gerencia sessoes
CREATE POLICY "sessions_service_role_only" ON professional_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- ════════════════════════════════════════════════════════════════════════
-- INDICES DE PERFORMANCE
-- ════════════════════════════════════════════════════════════════════════

-- Query principal do painel: todos os agendamentos de um cliente por data
CREATE INDEX IF NOT EXISTS idx_appointments_client_date
  ON appointments(client_id, date, status);

-- Query de disponibilidade: slots ocupados por profissional + data
CREATE INDEX IF NOT EXISTS idx_appointments_professional_date
  ON appointments(professional_id, date, status);

-- Query de pendentes: agendamentos pendentes de um cliente
CREATE INDEX IF NOT EXISTS idx_appointments_client_pending
  ON appointments(client_id, status)
  WHERE status = 'pending';

-- Busca por cliente no catalogo
CREATE INDEX IF NOT EXISTS idx_services_client
  ON services(client_id, active, sort_order);

CREATE INDEX IF NOT EXISTS idx_professionals_client
  ON professionals(client_id, active, accepts_booking);

-- ════════════════════════════════════════════════════════════════════════
-- REALTIME
-- Habilitar publicacao de eventos para o canal de agendamentos
-- ════════════════════════════════════════════════════════════════════════

-- Habilitar Realtime na tabela appointments
-- (Executar no painel Supabase > Database > Replication > appointments)
-- Ou via SQL:
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

-- ════════════════════════════════════════════════════════════════════════
-- SUPABASE AUTH HOOK — Injetar claim client_id no JWT
--
-- Para que o RLS funcione, cada usuario autenticado precisa ter
-- o claim 'client_id' no seu JWT.
--
-- Configurar em: Supabase Dashboard > Auth > Hooks > Custom Access Token
-- Funcao a criar (Edge Function): inject-client-id
--
-- A funcao busca o client_id de professional_sessions pela auth_user_id
-- e o adiciona como claim customizado no JWT retornado.
--
-- Exemplo da Edge Function (Deno/TypeScript):
-- ════════════════════════════════════════════════════════════════════════
--
-- import { createClient } from 'jsr:@supabase/supabase-js@2'
--
-- Deno.serve(async (req) => {
--   const { user } = await req.json()
--   const supabase = createClient(
--     Deno.env.get('SUPABASE_URL')!,
--     Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
--   )
--   const { data } = await supabase
--     .from('professional_sessions')
--     .select('client_id, professional_id')
--     .eq('auth_user_id', user.id)
--     .eq('active', true)
--     .single()
--
--   return new Response(JSON.stringify({
--     client_id:       data?.client_id ?? null,
--     professional_id: data?.professional_id ?? null,
--   }))
-- })
-- ════════════════════════════════════════════════════════════════════════
