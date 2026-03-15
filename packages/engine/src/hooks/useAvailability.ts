'use client'

/**
 * SiteFlow Engine — useAvailability Hook
 *
 * Calcula os slots de horario disponiveis para uma data + profissional.
 * Consulta o Supabase e cruza com o horario de funcionamento do cliente.
 */

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseClient } from '../lib/supabase'
import type { WeeklyHours, TimeSlot } from '../types'

const DAY_KEYS: Array<keyof WeeklyHours> = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

/** Gera slots de 30 em 30 minutos entre abertura e fechamento */
function generateSlots(open: string, close: string): string[] {
  const slots: string[] = []
  const [openH, openM] = open.split(':').map(Number)
  const [closeH, closeM] = close.split(':').map(Number)
  const openTotal = openH * 60 + openM
  const closeTotal = closeH * 60 + closeM

  for (let t = openTotal; t < closeTotal; t += 30) {
    const h = Math.floor(t / 60).toString().padStart(2, '0')
    const m = (t % 60).toString().padStart(2, '0')
    slots.push(`${h}:${m}`)
  }
  return slots
}

interface UseAvailabilityOptions {
  clientId: string
  professionalId: string | null
  date: string | null          // 'YYYY-MM-DD'
  hours: WeeklyHours
}

interface UseAvailabilityResult {
  slots: TimeSlot[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useAvailability({
  clientId,
  professionalId,
  date,
  hours,
}: UseAvailabilityOptions): UseAvailabilityResult {
  const [slots, setSlots]   = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const fetchSlots = useCallback(async () => {
    if (!date || !professionalId) {
      setSlots([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Determinar horario do dia
      const dayOfWeek = new Date(date + 'T12:00:00').getDay()
      const dayKey = DAY_KEYS[dayOfWeek]
      const dayHours = hours[dayKey]

      if (dayHours.closed) {
        setSlots([])
        return
      }

      // Gerar todos os slots possiveis
      const allSlots = generateSlots(dayHours.open, dayHours.close)

      // Buscar slots ocupados no Supabase
      const supabase = createSupabaseClient()
      const { data, error: dbError } = await supabase
        .from('appointments')
        .select('time')
        .eq('client_id', clientId)
        .eq('professional_id', professionalId)
        .eq('date', date)
        .in('status', ['pending', 'confirmed'])

      if (dbError) throw new Error(dbError.message)

      const occupied = new Set(
        (data ?? []).map(row => row.time.substring(0, 5))
      )

      setSlots(
        allSlots.map(time => ({ time, occupied: occupied.has(time) }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar horarios')
      setSlots([])
    } finally {
      setLoading(false)
    }
  }, [clientId, professionalId, date, hours])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  return { slots, loading, error, refetch: fetchSlots }
}
