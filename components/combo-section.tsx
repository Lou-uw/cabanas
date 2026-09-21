'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COMBO, formatGs } from '@/lib/menu'
import { useCart } from '@/lib/cart-context'

export function ComboSection() {
  const { addItem, openCart } = useCart()

  const addCombo = () => {
    addItem({
      productId: COMBO.id,
      name: COMBO.name,
      image: COMBO.image,
      unitPrice: COMBO.price,
      quantity: 1,
    })
    openCart()
  }

  return (
    <section id="combo" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card">
        <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
              Combo del día
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
              {COMBO.name}
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">{COMBO.description}</p>

            <div className="mt-6 flex items-center gap-3">
              <span className="font-serif text-4xl font-black text-primary">
                {formatGs(COMBO.price)}
              </span>
            </div>

            <Button
              onClick={addCombo}
              size="lg"
              className="mt-6 gap-2 rounded-full px-8 font-semibold"
            >
              <Plus className="size-5" aria-hidden />
              Agregar combo al pedido
            </Button>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image
              src={COMBO.image || '/placeholder.svg'}
              alt="Combo de pizza familiar con gaseosa"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
