/**
 * SiteFlow Engine — Entry Point
 * Exporta tudo que apps e clients precisam importar da engine.
 */

// Types
export * from './types'

// Lib
export { createSupabaseClient, getServices, getProfessionals, getOccupiedSlots, createAppointment, updateAppointmentStatus, getAppointments } from './lib/supabase'
export { createSanityClient, getBusinessInfo, getTestimonials, getGalleryItems } from './lib/sanity'
export { BREAKPOINTS, isMobile, mq } from './lib/responsive'

// Hooks
export { useAvailability } from './hooks/useAvailability'
export { useRealtimeAppointments } from './hooks/useRealtime'
