import { useState, useEffect } from 'react'
import { obtenerProducto } from '../services/ProductoService'
import { obtenerTamanio } from '../services/TamanioService'
import { Producto } from '@/types/producto'
import { Tamanio } from '@/types/tamanio'
import { Product, SizeOption } from '@/lib/menu'

const FEATURED = [
  'calabreza',
  'especial de la cabana',
  'jamon',
  'cuatro quesos',
]

// Imagen de cada pizza según el nombre del producto (sin acentos).
// Si una pizza no está en esta lista, se usa la imagen genérica de su categoría.
const IMAGENES_PIZZAS: Record<string, string> = {
    'napolitana': '/images/pizza-napolitana.png',
    'jamon': '/images/pizza-jamon.png',
    'mozzarella': '/images/pizza-muzzarella.png',
    'muzzarella': '/images/pizza-muzzarella.png',
    'margarita': '/images/pizza-margarita.png',
    'calabreza': '/images/pizza-calabresa.png',
    'calabresa': '/images/pizza-calabresa.png',
    'calabresa picante': '/images/pizza-calabresa-picante.png',
    'calabresa al ajo': '/images/pizza-calabresa.png',
    'bacon': '/images/pizza-bacon.png',
    'bacon al ajo': '/images/pizza-bacon-ajo.png',
    'pollo catupiry': '/images/pizza-pollo-catupiry.png',
    'caipira': '/images/pizza-caipira.png',
    'pizza al ajo': '/images/pizza-al-ajo.png',
    'palmito': '/images/pizza-palmito.png',
    'especial de la cabana': '/images/pizza-cabana.png',
    'pepperoni': '/images/pizza-pepperoni.png',
    'peperoni': '/images/pizza-pepperoni.png',
    'cuatro quesos': '/images/pizza-cuatro-quesos.png',
    'atun': '/images/pizza-atun.png',
    'portuguesa': '/images/pizza-portuguesa.png',
    'vegetariana': '/images/pizza-vegetariana.png',
    'mexicana': '/images/pizza-mexicana.png',
    'espanola': '/images/pizza-espanola.png',
}

// Saca acentos y pasa a minúsculas para comparar nombres.
function normalizar(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

// Devuelve true si la categoría es de pizza.
function esPizza(categoriaNombre: string | null): boolean {
    const nombre = normalizar(categoriaNombre ?? '')
    return nombre.includes('clasic') || nombre.includes('especial')
}

function slugify(value: string): string {
    return normalizar(value).replace(/\s+/g, '-')
}

function separarIngredientes(descripcion: string | null): string[] {
    if (!descripcion) return []

    return descripcion
        .split(',')
        .map((s) => s.trim().replace(/\.$/, ''))
        .filter(Boolean)
}

function imagenDelProducto(producto: Producto): string {
    const nombre = normalizar(producto.nombre)
    const categoria = normalizar(producto.categoriaNombre ?? '')

    if (categoria.includes('papa')) return '/images/papas-fritas.png'
    if (categoria.includes('gaseosa') || categoria.includes('bebida')) {
        return '/images/bebida-coca.png'
    }
    if (
        categoria.includes('adicional') ||
        categoria.includes('agregado') ||
        categoria.includes('borde')
    ) {
        return '/images/bordes.png'
    }

    const imagenPizza = IMAGENES_PIZZAS[nombre]
    if (imagenPizza) return imagenPizza

    return categoria.includes('especial')
        ? '/images/pizza-cabana.png'
        : '/images/pizza-muzzarella.png'
}

function preciosPorTamanio(
    producto: Producto,
    tamanios: Tamanio[],
): SizeOption[] {
    const esEspecial = normalizar(producto.categoriaNombre ?? '').includes('especial')

    return tamanios.map((tamanio) => ({
        id: tamanio.id,
        key: slugify(tamanio.nombre),
        label: tamanio.nombre,
        price: esEspecial ? tamanio.precioEspecial : tamanio.precioClasica,
        bordePrice: tamanio.precioBorde,
    }))
}

// Arma el producto con el formato que usa la tarjeta.
function armarProducto(producto: Producto, tamanios: Tamanio[]): Product {
    const pizza = esPizza(producto.categoriaNombre)

    return {
        id: String(producto.id),
        name: producto.nombre,
        category: producto.categoriaId,
        description: producto.descripcion ?? '',
        ingredients: pizza ? separarIngredientes(producto.descripcion) : [],
        image: producto.imagen ?? imagenDelProducto(producto),
        featured: FEATURED.includes(normalizar(producto.nombre)),
        sizes: pizza ? preciosPorTamanio(producto, tamanios) : undefined,
        price: pizza ? undefined : (producto.precio ?? 0),
        allowBorde: pizza,
    activo: producto.activo,
    }
}

export function useProducto() {
    const [prods, setProds] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    
    const traerProds = async () => {
        try {
            const [productos, tamanios] = await Promise.all([
                obtenerProducto(),
                obtenerTamanio(),
            ])

            setProds(
                productos.map((producto) => armarProducto(producto, tamanios)),
            )
            setError(null)
        } catch(error) {
            console.log(error)
            setError(error instanceof Error ? error.message : String(error))
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        traerProds()
    },[])
    return{ prods, loading, error, refetch: traerProds }
}
