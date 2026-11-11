'use client'

import { PageHeader } from '@/components/page-header'
import { CartSheet } from '@/components/cart-sheet'

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Sobre Nosotros"
        subtitle="De donde nacieron nuestras pizzas"
      />
      
      <main className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 sm:pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10">
          <p className="max-w-3xl text-lg sm:text-xl font-medium leading-relaxed text-muted-foreground">
            Nuestro pequeño negocio creció con mucho esfuerzo detrás, somos una familia que trabaja todos los dias para darte las mejores pizzas. Masa hecha con paciencia, mucho amor y calidez para que cada porción se sienta como estar en la cabaña. Pedí, compartí y disfrutá.
          </p>
        </div>
      </main>

      <CartSheet />
    </div>
  )
}