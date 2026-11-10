export type PedidoDetalleRequest = {
  // Cada ítem es un producto o un combo, nunca los dos.
  productoId?: number | null
  comboId?: number | null
  tamanioId?: number
  conBorde?: boolean
  cantidad: number
}

export type PedidoRequest = {
  clienteNombre: string
  clienteTelefono: string
  formaPago: string
  direccionEntrega: string
  notas?: string | null
  detalles: PedidoDetalleRequest[]
}

export type PedidoDetalleResponse = {
  id: number
  productoId: number | null
  producto: string
  comboId: number | null
  combo: string | null
  tamanioId: number | null
  conBorde: boolean
  cantidad: number
  precioUnitario: number | string
  precioBorde: number | string
  subtotal: number | string
}

export type PedidoResponse = {
  id: number
  fecha: string | null
  total: number | string
  estado: string | null
  formaPago: string | null
  clienteNombre: string | null
  clienteTelefono: string | null
  direccionEntrega: string | null
  notas: string | null
  detalles: PedidoDetalleResponse[]
}
