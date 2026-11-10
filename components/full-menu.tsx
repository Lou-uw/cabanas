'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCategoria } from '@/hooks/useCategoria'
import { useProducto } from '@/hooks/useProducto'
import { ProductCard } from './product-card'

export function FullMenu() {
  const { prods, loading: loadingProductos, error: errorProductos } = useProducto()
  const { categorias, loading: loadingCategorias, error: errorCategorias } = useCategoria()

  const loading = loadingProductos || loadingCategorias
  const error = errorProductos ?? errorCategorias

  // Las pizzas dulces no se muestran.
  const categories = categorias.filter(
    (cat) => !cat.nombre.toLowerCase().includes('dulce'),
  )

  if (loading) {
    return (
      <section id="menu" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-muted-foreground">Cargando menú...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section id="menu" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-destructive">No se pudo cargar el menú: {String(error)}</p>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section id="menu" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-muted-foreground">No hay productos disponibles.</p>
      </section>
    )
  }

  return (
    <section
      id="menu"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Nuestro menú
        </span>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Todo para elegir
        </h2>
        <p className="max-w-xl text-muted-foreground">
          Clásicas, especiales, papas, bebidas y todo lo que hace falta para
          completar tu pedido.
        </p>
      </div>

      <Tabs defaultValue={String(categories[0]?.id)} className="w-full">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex h-auto w-max gap-1 bg-card p-1">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={String(cat.id)}
                className="whitespace-nowrap rounded-lg px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat.nombre}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((cat) => {
          const items = prods.filter((p) => p.category === cat.id)

          return (
            <TabsContent key={cat.id} value={String(cat.id)} className="mt-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </section>
  )
}
