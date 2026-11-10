import { url_api } from '@/config'
import type { Producto } from '@/types/producto'

export async function obtenerProducto(): Promise<Producto[]> {
  const respuesta = await fetch(`${url_api}productos`)

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los productos`)
  }

  return (await respuesta.json()) as Producto[]
}
