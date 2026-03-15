-- ════════════════════════════════════════════════════════════════════════
-- SiteFlow — Seed: Divas Hair
-- Executar APOS a migration 001_initial_schema.sql
-- ════════════════════════════════════════════════════════════════════════

-- ── SERVICOS ─────────────────────────────────────────────────────────────
INSERT INTO services (client_id, slug, name, emoji, duration_min, duration_label, description, active, sort_order) VALUES
  ('divas-hair', 'corte-escova',       'Corte & Escova',         '✂️',  45,  '45 min',  'Do corte que transforma à escova que realça o brilho natural dos seus fios.', true, 1),
  ('divas-hair', 'coloracao-mechas',   'Coloração & Mechas',     '🎨',  120, '2h',      'Cores vibrantes, mechas naturais ou transformações ousadas.', true, 2),
  ('divas-hair', 'tratamentos',        'Tratamentos Capilares',  '💆',  60,  '1h',      'Nutrição, hidratação e reconstrução para fios de todos os tipos.', true, 3),
  ('divas-hair', 'manicure-pedicure',  'Manicure & Pedicure',    '💅',  45,  '45 min',  'Mãos e pés impecáveis com capricho nos detalhes.', true, 4),
  ('divas-hair', 'sobrancelha-cilios', 'Sobrancelha & Cílios',   '👁',  30,  '30 min',  'O enquadramento perfeito do olhar com técnicas modernas.', true, 5),
  ('divas-hair', 'maquiagem-noivas',   'Maquiagem & Noivas',     '💍',  90,  '1h 30min','Da make do dia ao grande dia.', true, 6),
  ('divas-hair', 'depilacao',          'Depilação',              '🪶',  60,  '1h',      'Pele sedosa e confortável com técnicas suaves e eficazes.', true, 7),
  ('divas-hair', 'unhas-gel',          'Unhas em Gel & Acrílico','💎',  90,  '1h 30min','Unhas alongadas, modeladas e decoradas para durar semanas.', true, 8)
ON CONFLICT (client_id, slug) DO NOTHING;

-- ── PROFISSIONAIS ────────────────────────────────────────────────────────
INSERT INTO professionals (client_id, slug, name, initials, role, specialties, accepts_booking, active) VALUES
  ('divas-hair', 'ana-lima',       'Ana Lima',       'AL', 'Especialista em Cabelos',    ARRAY['Coloração','Corte','Balayage','Cacheados'], true, true),
  ('divas-hair', 'patricia-santos','Patrícia Santos', 'PS', 'Manicure & Nail Designer',  ARRAY['Gel','Nail Art','Acrílico','Pedicure'],    true, true),
  ('divas-hair', 'juliana-costa',  'Juliana Costa',  'JC', 'Make & Estética',           ARRAY['Maquiagem','Noivas','Sobrancelha','Cílios'],true, true)
ON CONFLICT (client_id, slug) DO NOTHING;

-- ── AGENDAMENTOS DE DEMONSTRACAO ────────────────────────────────────────
-- Usar CURRENT_DATE para garantir que os seeds sejam validos na data de execucao

DO $$
DECLARE
  v_ana_id       UUID;
  v_patricia_id  UUID;
  v_juliana_id   UUID;
  v_corte_id     UUID;
  v_color_id     UUID;
  v_trat_id      UUID;
  v_manicure_id  UUID;
BEGIN
  SELECT id INTO v_ana_id       FROM professionals WHERE client_id='divas-hair' AND slug='ana-lima';
  SELECT id INTO v_patricia_id  FROM professionals WHERE client_id='divas-hair' AND slug='patricia-santos';
  SELECT id INTO v_juliana_id   FROM professionals WHERE client_id='divas-hair' AND slug='juliana-costa';
  SELECT id INTO v_corte_id     FROM services WHERE client_id='divas-hair' AND slug='corte-escova';
  SELECT id INTO v_color_id     FROM services WHERE client_id='divas-hair' AND slug='coloracao-mechas';
  SELECT id INTO v_trat_id      FROM services WHERE client_id='divas-hair' AND slug='tratamentos';
  SELECT id INTO v_manicure_id  FROM services WHERE client_id='divas-hair' AND slug='manicure-pedicure';

  -- Agendamentos confirmados para hoje (demonstracao do painel)
  INSERT INTO appointments (client_id, client_name, client_phone, service_id, professional_id, date, time, status, source)
  VALUES
    ('divas-hair', 'Fernanda Oliveira', '(11) 9 9001-0001', v_corte_id,    v_ana_id,      CURRENT_DATE, '09:00', 'confirmed', 'website'),
    ('divas-hair', 'Camila Rocha',      '(11) 9 9001-0002', v_color_id,    v_ana_id,      CURRENT_DATE, '11:00', 'confirmed', 'website'),
    ('divas-hair', 'Beatriz Mendes',    '(11) 9 9001-0003', v_trat_id,     v_patricia_id, CURRENT_DATE, '14:00', 'confirmed', 'website'),
    ('divas-hair', 'Larissa Ferreira',  '(11) 9 9001-0004', v_corte_id,    v_juliana_id,  CURRENT_DATE, '16:30', 'confirmed', 'website'),

    -- Pendentes para amanha e depois (demonstracao do fluxo de confirmacao)
    ('divas-hair', 'Mariana Costa',     '(11) 9 9001-0005', v_trat_id,     v_ana_id,      CURRENT_DATE + 1, '09:30', 'pending', 'website'),
    ('divas-hair', 'Tatiane Nunes',     '(11) 9 9001-0006', v_corte_id,    v_juliana_id,  CURRENT_DATE + 2, '14:00', 'pending', 'website'),
    ('divas-hair', 'Jessica Lima',      '(11) 9 9001-0007', v_manicure_id, v_patricia_id, CURRENT_DATE + 2, '10:00', 'pending', 'website');

END $$;
