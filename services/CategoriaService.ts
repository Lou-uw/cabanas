import { url_api } from '@/config'
import type { Categorias } from '@/types/categorias'

export async function obtenerCategoria(): Promise<Categorias[]> {
  const respuesta = await fetch(`${url_api}categorias`)

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener las categorías`)
  }

  return (await respuesta.json()) as Categorias[]
}
