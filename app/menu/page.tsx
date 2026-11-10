'use client'

import { PageHeader } from '@/components/page-header'
import { FullMenu } from '@/components/full-menu'
import { ProductModal } from '@/components/product-modal'
import { CartSheet } from '@/components/cart-sheet'

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Menú completo"
        subtitle="Todo para elegir. Clásicas, especiales, papas, bebidas y todo lo que hace falta para completar tu pedido."
      />
      <FullMenu />
      <ProductModal />
      <CartSheet />
    </div>
  )
}
