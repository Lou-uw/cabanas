export type CategoryId =
  | 'clasicas'
  | 'especiales'
  | 'dulces'
  | 'papas'
  | 'bebidas'
  | 'agregados'

export type SizeKey = 'mediana' | 'familiar' | 'gigante'

export type SizeOption = {
  key: SizeKey
  label: string
  price: number
}

export type BordeOption = {
  id: string
  label: string
  price: number
}

export type Product = {
  id: string
  name: string
  category: CategoryId
  description: string
  ingredients: string[]
  image: string
  featured?: boolean
  /** Pizzas use per-size pricing */
  sizes?: SizeOption[]
  /** Non-pizza items use a single fixed price */
  price?: number
  /** Whether stuffed-crust borders can be added */
  allowBorde?: boolean
}

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'clasicas', label: 'Pizzas Clásicas' },
  { id: 'especiales', label: 'Pizzas Especiales' },
  { id: 'dulces', label: 'Pizzas Dulces' },
  { id: 'papas', label: 'Papas Fritas' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'agregados', label: 'Agregados / Bordes' },
]

export const BORDES: BordeOption[] = [
  { id: 'sin', label: 'Sin borde relleno', price: 0 },
  { id: 'catupiry', label: 'Borde de Catupiry', price: 10000 },
  { id: 'cheddar', label: 'Borde de Cheddar', price: 10000 },
  { id: 'chocolate', label: 'Borde de Chocolate', price: 10000 },
]

function pizzaSizes(mediana: number, familiar: number, gigante: number): SizeOption[] {
  return [
    { key: 'mediana', label: 'Mediana', price: mediana },
    { key: 'familiar', label: 'Familiar', price: familiar },
    { key: 'gigante', label: 'Gigante', price: gigante },
  ]
}

export const PRODUCTS: Product[] = [
  // ---- Pizzas Clásicas ----
  {
    id: 'muzzarella',
    name: 'Pizza Muzzarella',
    category: 'clasicas',
    description: 'La clásica de siempre, simple y perfecta.',
    ingredients: ['Salsa de tomate', 'Abundante muzzarella', 'Orégano', 'Aceitunas'],
    image: '/images/pizza-muzzarella.png',
    sizes: pizzaSizes(40000, 55000, 70000),
    allowBorde: true,
  },
  {
    id: 'calabresa',
    name: 'Pizza Calabresa',
    category: 'clasicas',
    description: 'Intensa y sabrosa, una de las más pedidas de la casa.',
    ingredients: ['Salsa de tomate', 'Muzzarella', 'Calabresa', 'Cebolla', 'Orégano'],
    image: '/images/pizza-calabresa.png',
    featured: true,
    sizes: pizzaSizes(45000, 60000, 75000),
    allowBorde: true,
  },
  {
    id: 'jamon',
    name: 'Pizza Jamón',
    category: 'clasicas',
    description: 'Jamón y queso derretido, la combinación que nunca falla.',
    ingredients: ['Salsa de tomate', 'Muzzarella', 'Jamón', 'Orégano'],
    image: '/images/pizza-jamon.png',
    featured: true,
    sizes: pizzaSizes(45000, 60000, 75000),
    allowBorde: true,
  },
  {
    id: 'napolitana',
    name: 'Pizza Napolitana',
    category: 'clasicas',
    description: 'Tomate fresco y ajo sobre una base de muzzarella.',
    ingredients: ['Salsa de tomate', 'Muzzarella', 'Tomate fresco', 'Ajo', 'Albahaca'],
    image: '/images/pizza-napolitana.png',
    sizes: pizzaSizes(45000, 60000, 75000),
    allowBorde: true,
  },
  {
    id: 'cuatro-quesos',
    name: 'Pizza Cuatro Quesos',
    category: 'clasicas',
    description: 'Cuatro quesos fundidos para los amantes del queso.',
    ingredients: ['Muzzarella', 'Cheddar', 'Roquefort', 'Parmesano'],
    image: '/images/pizza-cuatro-quesos.png',
    featured: true,
    sizes: pizzaSizes(50000, 65000, 80000),
    allowBorde: true,
  },

  // ---- Pizzas Especiales ----
  {
    id: 'la-cabana',
    name: 'Especial "La Cabaña"',
    category: 'especiales',
    description: 'Nuestra pizza insignia, cargada de sabor de punta a punta.',
    ingredients: [
      'Salsa de tomate',
      'Muzzarella',
      'Jamón',
      'Morrón',
      'Huevo',
      'Aceitunas',
    ],
    image: '/images/pizza-cabana.png',
    featured: true,
    sizes: pizzaSizes(55000, 70000, 85000),
    allowBorde: true,
  },
  {
    id: 'especial-mixta',
    name: 'Pizza Especial Mixta',
    category: 'especiales',
    description: 'Una mezcla generosa de fiambres y quesos.',
    ingredients: ['Salsa de tomate', 'Muzzarella', 'Jamón', 'Calabresa', 'Morrón'],
    image: '/images/pizza-calabresa.png',
    sizes: pizzaSizes(52000, 68000, 82000),
    allowBorde: true,
  },

  // ---- Pizzas Dulces ----
  {
    id: 'chocolate',
    name: 'Pizza de Chocolate',
    category: 'dulces',
    description: 'El postre perfecto para cerrar la noche.',
    ingredients: ['Chocolate con leche', 'Chocolate blanco', 'Banana', 'Confites'],
    image: '/images/pizza-chocolate.png',
    sizes: pizzaSizes(45000, 58000, 72000),
    allowBorde: true,
  },
  {
    id: 'dulce-de-leche',
    name: 'Pizza Dulce de Leche',
    category: 'dulces',
    description: 'Dulce de leche con banana y un toque de canela.',
    ingredients: ['Dulce de leche', 'Banana', 'Canela'],
    image: '/images/pizza-chocolate.png',
    sizes: pizzaSizes(45000, 58000, 72000),
    allowBorde: true,
  },

  // ---- Papas Fritas ----
  {
    id: 'papas-simples',
    name: 'Papas Fritas',
    category: 'papas',
    description: 'Porción de papas fritas crocantes, doradas y saladas.',
    ingredients: ['Papas', 'Sal'],
    image: '/images/papas-fritas.png',
    price: 20000,
  },
  {
    id: 'papas-cheddar',
    name: 'Papas con Cheddar',
    category: 'papas',
    description: 'Papas fritas bañadas en salsa cheddar.',
    ingredients: ['Papas', 'Salsa cheddar', 'Sal'],
    image: '/images/papas-fritas.png',
    price: 28000,
  },

  // ---- Bebidas ----
  {
    id: 'coca-1500',
    name: 'Coca Cola 1.5 Lts',
    category: 'bebidas',
    description: 'Gaseosa Coca Cola bien fría de 1.5 litros.',
    ingredients: [],
    image: '/images/bebida-coca.png',
    price: 12000,
  },
  {
    id: 'coca-3000',
    name: 'Coca Cola 3 Lts',
    category: 'bebidas',
    description: 'Gaseosa Coca Cola bien fría de 3 litros.',
    ingredients: [],
    image: '/images/bebida-coca.png',
    price: 18000,
  },
  {
    id: 'agua',
    name: 'Agua Mineral 500 ml',
    category: 'bebidas',
    description: 'Agua mineral sin gas.',
    ingredients: [],
    image: '/images/bebida-coca.png',
    price: 6000,
  },

  // ---- Agregados / Bordes ----
  {
    id: 'borde-catupiry',
    name: 'Borde de Catupiry',
    category: 'agregados',
    description: 'Agregá un borde relleno de catupiry a tu pizza.',
    ingredients: ['Catupiry'],
    image: '/images/bordes.png',
    price: 10000,
  },
  {
    id: 'borde-cheddar',
    name: 'Borde de Cheddar',
    category: 'agregados',
    description: 'Agregá un borde relleno de cheddar a tu pizza.',
    ingredients: ['Cheddar'],
    image: '/images/bordes.png',
    price: 10000,
  },
]

export const COMBO = {
  id: 'combo-imperdible',
  name: 'Combo Imperdible',
  description: 'Pizza Familiar (a elección clásica) + Coca Cola 3 Lts.',
  price: 50000,
  image: '/images/combo.png',
}

export function formatGs(value: number): string {
  return `${value.toLocaleString('es-PY').replace(/,/g, '.')} Gs`
}

export function getFeatured(): Product[] {
  const order = ['calabresa', 'la-cabana', 'jamon', 'cuatro-quesos']
  return order
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
}
