import { useState, useEffect } from 'react'
import { obtenerPromoHoy } from '@/services/PromoService'
import type { PromoInfo } from '@/types/promo'

const DIAS_SEMANA: Record<string, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
}

const DIAS_CON_PROMO: Record<string, string> = {
  WEDNESDAY: 'miercoles',
  FRIDAY: 'viernes',
  SATURDAY: 'fin_de_semana',
  SUNDAY: 'fin_de_semana',
}

const PROXIMO_DIA_PROMO: Record<string, string> = {
  MONDAY: 'Miércoles',
  TUESDAY: 'Miércoles',
  WEDNESDAY: 'Viernes',
  THURSDAY: 'Viernes',
  FRIDAY: 'Sábado',
  SATURDAY: 'Domingo',
  SUNDAY: 'Miércoles',
}

export function usePromo(forzada?: string) {
  const [promo, setPromo] = useState<PromoInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const diaForzado = forzada?.toUpperCase()
    
    obtenerPromoHoy()
      .then((data) => {
        if (cancelled) return
        
        // Si hay día forzado, sobreescribir el día de la semana
        let diaSemana = data.diaSemana
        let hayPromoActiva = data.hayPromoActiva
        let tipoPromo = data.tipoPromo
        
        if (diaForzado && DIAS_SEMANA[diaForzado]) {
          diaSemana = diaForzado
          tipoPromo = DIAS_CON_PROMO[diaForzado] || null
          hayPromoActiva = tipoPromo !== null
        }

        setPromo({
          ...data,
          diaSemana,
          hayPromoActiva,
          tipoPromo,
        })
        setLoading(false)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err))
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [forzada])

  return { promo, loading, error }
}

export function getDiaSemanaNombre(dia: string): string {
  return DIAS_SEMANA[dia] || dia
}

export function getProximoDiaPromo(dia: string): string {
  return PROXIMO_DIA_PROMO[dia] || 'Miércoles'
}
