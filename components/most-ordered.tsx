'use client'

import { useCallback, useState } from 'react'
import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useProducto } from '@/hooks/useProducto'

export function MostOrdered() {
  const { prods, loading, error, refetch } = useProducto()

  const featured = prods.filter((p) => p.featured).slice(0, 4)
  const destacados =
    featured.length > 0
      ? featured
      : prods.filter((p) => p.sizes).slice(0, 4)

  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  return (
    <section
      id="destacados"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Las favoritas
        </span>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Lo más pedido
        </h2>
        <p className="max-w-xl text-muted-foreground">
          Las pizzas que hacen que nuestros clientes vuelvan una y otra vez.
        </p>
      </div>

      {loading && (
        <p className="text-muted-foreground">Cargando destacados...</p>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center gap-3 p-8 text-center rounded-lg border border-destructive/50 bg-destructive/10">
          <p className="text-destructive">
            No se pudieron cargar los destacados. Verificá que el servidor esté
            encendido.
          </p>
          <Button
            onClick={handleRetry}
            variant="outline"
          >
            <RefreshCw className="size-4 mr-2" />
            Reintentar
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
