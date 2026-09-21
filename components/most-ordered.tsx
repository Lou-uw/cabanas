import { getFeatured } from '@/lib/menu'
import { ProductCard } from './product-card'

export function MostOrdered() {
  const featured = getFeatured()

  return (
    <section id="destacados" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Las favoritas
        </span>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">Lo más pedido</h2>
        <p className="max-w-xl text-muted-foreground">
          Las pizzas que hacen que nuestros clientes vuelvan una y otra vez.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
