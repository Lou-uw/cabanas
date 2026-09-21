'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatGs, type Product } from '@/lib/menu'
import { useProductUI } from '@/lib/product-ui-context'

function startingPrice(product: Product): { label: string; value: number } {
  if (product.sizes && product.sizes.length > 0) {
    const min = Math.min(...product.sizes.map((s) => s.price))
    return { label: 'Desde', value: min }
  }
  return { label: '', value: product.price ?? 0 }
}

export function ProductCard({ product }: { product: Product }) {
  const { openProduct } = useProductUI()
  const price = startingPrice(product)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40">
      <button
        type="button"
        onClick={() => openProduct(product)}
        className="relative aspect-[4/3] overflow-hidden"
        aria-label={`Ver ${product.name}`}
      >
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <Badge className="absolute left-3 top-3 rounded-full bg-primary text-primary-foreground hover:bg-primary">
            Más pedida
          </Badge>
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-bold leading-tight">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3 pt-2">
          <div className="leading-none">
            {price.label && (
              <span className="block text-xs text-muted-foreground">{price.label}</span>
            )}
            <span className="font-serif text-xl font-bold text-primary">
              {formatGs(price.value)}
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => openProduct(product)}
            className="gap-1.5 rounded-full font-semibold"
          >
            <Plus className="size-4" aria-hidden />
            Agregar
          </Button>
        </div>
      </div>
    </article>
  )
}
