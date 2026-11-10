import { url_api } from '@/config'
import type { Tamanio } from '@/types/tamanio'

export async function obtenerTamanio(): Promise<Tamanio[]> {
  const respuesta = await fetch(`${url_api}tamanios`)

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los tamaños`)
  }

  return (await respuesta.json()) as Tamanio[]
}
