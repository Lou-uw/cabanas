export type Producto = {
    id: number,
    nombre: string,
    descripcion: string,
    categoriaId: number,
    categoriaNombre: string,
    precio: number,
    stock: number,
    activo: boolean
}