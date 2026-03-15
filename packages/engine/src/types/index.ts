/**
 * SiteFlow Engine — Types
 *
 * Tipos centrais compartilhados entre engine, clients e apps.
 * Qualquer adição aqui afeta toda a plataforma — alterar com cuidado.
 */

// ─── CONFIG DO CLIENTE ────────────────────────────────────────────────────────

export interface SiteFlowClientConfig {
  /** Slug unico usado em URLs, banco e monorepo. Ex: 'divas-hair' */
  slug: string

  /** Mesmo valor do slug — usado como client_id nas tabelas Supabase (RLS) */
  clientId: string

  /** Nome do negocio como aparece no site e nos contratos */
  businessName: string

  /** Frase curta de posicionamento exibida no hero */
  tagline: string

  /** Segmento de mercado. Define comportamentos visuais e funcionais */
  segment: ClientSegment

  /** Variante do design system. Nome do arquivo CSS em styles/variants/ */
  template: string

  contact: ContactConfig
  hours: WeeklyHours
  design: DesignConfig
  sections: SectionsConfig
  features: FeaturesConfig
  seo: SeoConfig
  sanity: SanityConfig
}

export type ClientSegment =
  | 'salao-beleza'
  | 'barbearia'
  | 'clinica'
  | 'nail-studio'
  | 'academia'
  | 'restaurante'
  | 'petshop'
  | 'outro'

// ─── CONTATO ──────────────────────────────────────────────────────────────────

export interface ContactConfig {
  /** Numero com DDI e DDD, sem formatacao. Ex: '5511900000000' */
  whatsapp: string
  email?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  googleMapsUrl?: string
  instagram?: string
  tiktok?: string
  facebook?: string
}

// ─── HORARIOS ────────────────────────────────────────────────────────────────

export interface DayHours {
  open: string   // 'HH:MM'
  close: string  // 'HH:MM'
  closed?: boolean
}

export interface WeeklyHours {
  mon: DayHours
  tue: DayHours
  wed: DayHours
  thu: DayHours
  fri: DayHours
  sat: DayHours
  sun: DayHours
}

// ─── DESIGN ───────────────────────────────────────────────────────────────────

export interface DesignConfig {
  /** Nome do arquivo CSS em packages/design-system/styles/variants/ */
  styleVariant: 'dark-elegant' | 'light-minimal' | 'vibrant' | 'organic' | string

  /** Cor primaria em HEX. Ex: '#6B21A8' */
  primaryColor: string

  /** Cor de acento em HEX. Ex: '#D4AF8A' */
  accentColor: string

  /** Esquema de cores predominante */
  scheme: 'dark' | 'light' | 'mixed'

  /** Border-radius padrao. Ex: '16px' */
  borderRadius: string

  /** Fonte para titulos e display */
  displayFont: string

  /** Fonte para textos de corpo */
  bodyFont: string
}

// ─── SECOES ───────────────────────────────────────────────────────────────────

export interface SectionsConfig {
  hero:         boolean
  about:        boolean
  services:     boolean
  team:         boolean
  booking:      boolean
  panel:        boolean
  gallery:      boolean
  testimonials: boolean
  contact:      boolean
  footer:       boolean
}

// ─── FEATURES ────────────────────────────────────────────────────────────────

export interface FeaturesConfig {
  /** Habilita o fluxo de agendamento online */
  booking: boolean

  /** Como os agendamentos sao confirmados */
  bookingConfirm: 'manual' | 'automatic'

  /** Habilita o painel da profissional */
  professionalPanel: boolean

  /** Exibe galeria de fotos */
  gallery: boolean

  /** Botao flutuante (FAB) de agendamento */
  whatsappFloat: boolean

  /** Gera Schema.org LocalBusiness */
  seoLocalBusiness: boolean

  /** Google Analytics 4 */
  googleAnalytics: boolean

  /** ID da propriedade GA4 — obrigatorio se googleAnalytics: true */
  googleAnalyticsId?: string

  /** Exibe precos nos cards de servico */
  showPrices?: boolean

  /** Programa de fidelidade (feature flag — desligado por padrao) */
  loyaltyProgram?: boolean
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export interface SeoConfig {
  title: string
  description: string
  city?: string
  region?: string
  keywords?: string[]
}

// ─── SANITY ───────────────────────────────────────────────────────────────────

export interface SanityConfig {
  projectId: string
  dataset: string
}

// ─── CONTEUDO — SERVICOS ─────────────────────────────────────────────────────

export interface Service {
  id: string
  slug: string
  name: string
  emoji: string
  durationMin: number
  durationLabel: string
  description: string
  priceFrom?: number
  priceTo?: number
  items?: string[]
  active: boolean
  sortOrder: number
}

// ─── CONTEUDO — PROFISSIONAIS ────────────────────────────────────────────────

export interface Professional {
  id: string
  slug: string
  name: string
  initials: string
  role: string
  specialties: string[]
  bio?: string
  photoUrl?: string
  acceptsBooking: boolean
  active: boolean
}

// ─── CONTEUDO — AGENDAMENTO ──────────────────────────────────────────────────

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Appointment {
  id: string
  clientId: string       // slug do salao (RLS)
  clientName: string
  clientPhone: string
  serviceId: string
  serviceName: string
  serviceEmoji: string
  serviceDuration: string
  professionalId: string
  professionalName: string
  date: string           // 'YYYY-MM-DD'
  time: string           // 'HH:MM'
  status: AppointmentStatus
  notes?: string
  source: 'website' | 'admin' | 'whatsapp'
  createdAt: string      // ISO datetime
  updatedAt: string      // ISO datetime
}

export interface BookingState {
  step: number
  clientName: string
  clientPhone: string
  service: Service | null
  professional: Professional | null
  date: string | null
  time: string | null
}

export interface TimeSlot {
  time: string    // 'HH:MM'
  occupied: boolean
}

// ─── CONTEUDO — DEPOIMENTOS ──────────────────────────────────────────────────

export interface Testimonial {
  id: string
  authorName: string
  serviceName: string
  text: string
  stars: 1 | 2 | 3 | 4 | 5
  photoUrl?: string
  isReal: boolean   // false = placeholder. Nunca exibir como real se false em prod
}

// ─── CONTEUDO — GALERIA ──────────────────────────────────────────────────────

export interface GalleryItem {
  id: string
  category: string
  imageUrl?: string
  placeholderGradient?: string
  label: string
  caption?: string
}

// ─── CONTEUDO — NEGOCIO ──────────────────────────────────────────────────────

export interface BusinessInfo {
  headline: string
  subheadline: string
  about: string[]
  stats: BusinessStat[]
  pillars: Pillar[]
}

export interface BusinessStat {
  value: string
  label: string
  isReal: boolean
}

export interface Pillar {
  icon: string
  title: string
  description: string
}

// ─── PAINEL DA PROFISSIONAL ──────────────────────────────────────────────────

export type PanelTab = 'agenda' | 'pendentes' | 'timeline' | 'stats'

export interface PanelStats {
  total: number
  confirmed: number
  pending: number
  cancelled: number
  confirmationRate: number
  topServices: Array<{ name: string; count: number }>
}
