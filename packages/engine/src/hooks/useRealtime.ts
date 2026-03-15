'use client'

/**
 * SiteFlow Engine — useRealtime Hook
 *
 * Subscreve ao canal Realtime do Supabase para um cliente especifico.
 * Quando um novo agendamento e criado, o callback onNewAppointment e chamado.
 *
 * Usado no ProfessionalPanel para atualizar a aba "Pendentes"
 * sem necessidade de refresh manual.
 */

import { useEffect, useRef } from 'react'
import { createSupabaseClient } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Appointment } from '../types'

interface UseRealtimeOptions {
  clientId: string
  onNewAppointment: (appointment: Partial<Appointment>) => void
  onStatusChange?: (id: string, status: Appointment['status']) => void
}

export function useRealtimeAppointments({
  clientId,
  onNewAppointment,
  onStatusChange,
}: UseRealtimeOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!clientId) return

    const supabase = createSupabaseClient()
    const channelName = `appointments:${clientId}`

    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>
          onNewAppointment({
            id:               row.id as string,
            clientId:         row.client_id as string,
            clientName:       row.client_name as string,
            clientPhone:      row.client_phone as string,
            serviceId:        row.service_id as string,
            professionalId:   row.professional_id as string,
            date:             row.date as string,
            time:             (row.time as string).substring(0, 5),
            status:           row.status as Appointment['status'],
            source:           row.source as Appointment['source'],
            createdAt:        row.created_at as string,
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          if (onStatusChange) {
            const row = payload.new as Record<string, unknown>
            onStatusChange(
              row.id as string,
              row.status as Appointment['status']
            )
          }
        }
      )
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [clientId, onNewAppointment, onStatusChange])
}
