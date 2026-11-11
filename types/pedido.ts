export type PedidoDetalleRequest = {
  productoId: number
  tamanioId: number
  conBorde?: boolean
  /** Si es true, el ítem es un regalo de promoción (precio 0) */
  esRegalo?: boolean
  cantidad: number
}

export type PedidoRequest = {
  clienteNombre: string
  clienteTelefono?: string | null
  formaPago: string
  direccionEntrega: string
  notas?: string | null
  detalles: PedidoDetalleRequest[]
}

export type PedidoDetalleResponse = {
  id: number
  productoId: number | null
  producto: string
  //////comboId: number | null
  ////combo: string | null
  tamanioId: number | null
  conBorde: boolean
  /** Si es true, el ítem es un regalo de promoción (precio 0) */
  esRegalo: boolean
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
