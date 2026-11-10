export type Producto = {
  id: number
  nombre: string
  descripcion: string | null
  categoriaId: number
  categoriaNombre: string | null
  precio: number | null
  stock: number | null
  activo: boolean
  // Opcionales: si algún día se agregan columnas en la base,
  // el adapter las usa sin cambiar nada más.
  imagen?: string | null
  ingredientes?: string | null
}
