import { url_api } from '@/config'
import type { Combo } from '@/types/combo'

export async function obtenerCombo(): Promise<Combo[]> {
  const respuesta = await fetch(`${url_api}combos`)

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los combos`)
  }

  return (await respuesta.json()) as Combo[]
}
