/**
 * SiteFlow Engine — Supabase Client
 *
 * Singleton do cliente Supabase.
 * Usado em Server Components (createServerClient) e
 * Client Components (createBrowserClient).
 *
 * IMPORTANTE: As variaveis de ambiente sao compartilhadas entre todos
 * os clientes. O isolamento de dados e feito via RLS no banco —
 * cada query e filtrada automaticamente pelo claim client_id no JWT.
 */

import { createClient } from '@supabase/supabase-js'
import type { Appointment, Service, Professional } from '../types'

// ─── TIPOS DO BANCO ───────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string
          client_id: string
          slug: string
          name: string
          emoji: string | null
          duration_min: number
          duration_label: string
          description: string | null
          price_from: number | null
          active: boolean
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      professionals: {
        Row: {
          id: string
          client_id: string
          slug: string
          name: string
          initials: string
          role: string | null
          specialties: string[]
          accepts_booking: boolean
          active: boolean
        }
        Insert: Omit<Database['public']['Tables']['professionals']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['professionals']['Insert']>
      }
      appointments: {
        Row: {
          id: string
          client_id: string
          client_name: string
          client_phone: string
          service_id: string
          professional_id: string
          date: string
          time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
          source: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>
      }
    }
  }
}

// ─── FACTORY ─────────────────────────────────────────────────────────────────

/**
 * Cliente para uso em Server Components e Route Handlers (Next.js).
 * Nao usa cookies — apenas a chave anonima publica.
 */
export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      '[SiteFlow] Variaveis de ambiente Supabase nao configuradas.\n' +
      'Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local'
    )
  }

  return createClient<Database>(url, key)
}

// ─── QUERIES REUTILIZAVEIS ────────────────────────────────────────────────────

/**
 * Busca os servicos ativos de um cliente.
 * O client_id no WHERE e redundante — a RLS ja filtra —
 * mas garante clareza e performance via indice.
 */
export async function getServices(clientId: string): Promise<Service[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('client_id', clientId)
    .eq('active', true)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(`[SiteFlow] Erro ao buscar servicos: ${error.message}`)

  return data.map(row => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    emoji: row.emoji ?? '',
    durationMin: row.duration_min,
    durationLabel: row.duration_label,
    description: row.description ?? '',
    priceFrom: row.price_from ?? undefined,
    active: row.active,
    sortOrder: row.sort_order,
  }))
}

/**
 * Busca profissionais que aceitam agendamento.
 */
export async function getProfessionals(clientId: string): Promise<Professional[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('client_id', clientId)
    .eq('active', true)
    .eq('accepts_booking', true)

  if (error) throw new Error(`[SiteFlow] Erro ao buscar profissionais: ${error.message}`)

  return data.map(row => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    initials: row.initials,
    role: row.role ?? '',
    specialties: row.specialties,
    acceptsBooking: row.accepts_booking,
    active: row.active,
  }))
}

/**
 * Busca horarios ocupados de uma data + profissional especifica.
 * Usado para bloquear slots no calendario de agendamento.
 */
export async function getOccupiedSlots(
  clientId: string,
  professionalId: string,
  date: string
): Promise<string[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('appointments')
    .select('time')
    .eq('client_id', clientId)
    .eq('professional_id', professionalId)
    .eq('date', date)
    .in('status', ['pending', 'confirmed'])

  if (error) throw new Error(`[SiteFlow] Erro ao buscar slots: ${error.message}`)

  return data.map(row => row.time.substring(0, 5)) // 'HH:MM:SS' -> 'HH:MM'
}

/**
 * Cria um novo agendamento.
 * Retorna o ID gerado pelo banco.
 */
export async function createAppointment(
  payload: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      client_id:        payload.clientId,
      client_name:      payload.clientName,
      client_phone:     payload.clientPhone,
      service_id:       payload.serviceId,
      professional_id:  payload.professionalId,
      date:             payload.date,
      time:             payload.time,
      status:           payload.status,
      notes:            payload.notes ?? null,
      source:           payload.source,
    })
    .select('id')
    .single()

  if (error) throw new Error(`[SiteFlow] Erro ao criar agendamento: ${error.message}`)

  return data.id
}

/**
 * Atualiza o status de um agendamento.
 * Usado no painel da profissional para confirmar ou recusar.
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  status: 'confirmed' | 'cancelled' | 'completed'
): Promise<void> {
  const supabase = createSupabaseClient()
  const { error } = await supabase
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', appointmentId)

  if (error) throw new Error(`[SiteFlow] Erro ao atualizar agendamento: ${error.message}`)
}

/**
 * Busca todos os agendamentos de um cliente (para o painel).
 * Requer autenticacao com JWT contendo claim client_id.
 */
export async function getAppointments(
  clientId: string,
  filters?: {
    date?: string
    status?: Appointment['status']
    professionalId?: string
  }
): Promise<Appointment[]> {
  const supabase = createSupabaseClient()
  let query = supabase
    .from('appointments')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  if (filters?.date)           query = query.eq('date', filters.date)
  if (filters?.status)         query = query.eq('status', filters.status)
  if (filters?.professionalId) query = query.eq('professional_id', filters.professionalId)

  const { data, error } = await query

  if (error) throw new Error(`[SiteFlow] Erro ao buscar agendamentos: ${error.message}`)

  return data.map(row => ({
    id: row.id,
    clientId: row.client_id,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    serviceId: row.service_id,
    serviceName: '',   // join nao necessario aqui — preenchido via join na query expandida
    serviceEmoji: '',
    serviceDuration: '',
    professionalId: row.professional_id,
    professionalName: '',
    date: row.date,
    time: row.time.substring(0, 5),
    status: row.status,
    notes: row.notes ?? undefined,
    source: row.source as Appointment['source'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}
