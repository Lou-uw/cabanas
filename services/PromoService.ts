import { url_api } from '@/config'
import type { PromoInfo } from '@/types/promo'

export async function obtenerPromoHoy(): Promise<PromoInfo> {
  const respuesta = await fetch(`${url_api}promos/hoy`)

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener la promo de hoy`)
  }

  return (await respuesta.json()) as PromoInfo
}

export async function obtenerPromoDia(dia: string): Promise<PromoInfo> {
  const respuesta = await fetch(`${url_api}promos/dia?dia=${dia}`)

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener la promo del día ${dia}`)
  }

  return (await respuesta.json()) as PromoInfo
}
