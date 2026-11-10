import { url_api } from '@/config'
import type { PedidoRequest, PedidoResponse } from '@/types/pedido'

export async function crearPedido(pedido: PedidoRequest): Promise<PedidoResponse> {
  const respuesta = await fetch(`${url_api}pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pedido),
  })

  if (!respuesta.ok) {
    let mensaje = `Error ${respuesta.status} al crear el pedido`

    try {
      const error = (await respuesta.json()) as { message?: string }
      if (error.message) mensaje = error.message
    } catch {
      // Si la respuesta no trae JSON, dejamos el mensaje genérico.
    }

    throw new Error(mensaje)
  }

  return (await respuesta.json()) as PedidoResponse
}
