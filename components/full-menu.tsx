'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CATEGORIES, PRODUCTS } from '@/lib/menu'
import { ProductCard } from './product-card'

export function FullMenu() {
  return (
    <section id="menu" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Nuestro menú
        </span>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">Todo para elegir</h2>
        <p className="max-w-xl text-muted-foreground">
          Clásicas, especiales, dulces y todo lo que hace falta para completar tu pedido.
        </p>
      </div>

      <Tabs defaultValue="clasicas" className="w-full">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex h-auto w-max gap-1 bg-card p-1">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="whitespace-nowrap rounded-lg px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {CATEGORIES.map((cat) => {
          const items = PRODUCTS.filter((p) => p.category === cat.id)
          return (
            <TabsContent key={cat.id} value={cat.id} className="mt-8">
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
