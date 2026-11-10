// Los tamaños vienen de la base (Mediana, Grande, Familiar...),
// así que la key no puede ser una unión cerrada.
export type SizeKey = string

export type SizeOption = {
  id?: number          // id real de tamanios, para futuros pedidos
  key: SizeKey
  label: string
  price: number
  bordePrice: number  // precio del borde para este tamaño
}

export type BordeOption = {
  id: string
  label: string
}

export type Product = {
  id: string
  name: string
  category: number // id de la tabla categorias
  description: string
  ingredients: string[]
  image: string
  featured?: boolean
  /** Pizzas usan precios por tamaño */
  sizes?: SizeOption[]
  /** Los productos que no son pizza usan un precio fijo */
  price?: number
  /** Solo las pizzas permiten borde relleno */
  allowBorde?: boolean
}

// El precio del borde no está acá: sale de tamanios.precio_borde.
export const BORDES: BordeOption[] = [
  { id: 'sin', label: 'Sin borde relleno' },
  { id: 'catupiry', label: 'Borde de Catupiry' },
  { id: 'cheddar', label: 'Borde de Cheddar' },
  { id: 'chocolate', label: 'Borde de Chocolate' },
]

export function formatGs(value: number): string {
  return `${value.toLocaleString('es-PY').replace(/,/g, '.')} Gs`
}
