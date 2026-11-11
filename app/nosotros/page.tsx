'use client'

import { PageHeader } from '@/components/page-header'
import { AboutFooter } from '@/components/about-footer'
import { CartSheet } from '@/components/cart-sheet'

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title=" Sobre Nosotros"
        subtitle="De donde nacieron nuestras pizzas"
      />
      <p>Nacimos como un refugio para los amantes de la buena pizza 
        en Ciudad del Este. Masa fermentada con paciencia, ingredientes frescos y el fuego justo
        para que cada porción se sienta como estar en la cabaña. Pedí, compartí y
        disfrutá.
</p>
      <CartSheet />
    </div>
  )
}
