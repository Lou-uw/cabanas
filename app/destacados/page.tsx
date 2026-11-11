'use client'

import { PageHeader } from '@/components/page-header'
import { MostOrdered } from '@/components/most-ordered'
import { ProductModal } from '@/components/product-modal'
import { CartSheet } from '@/components/cart-sheet'

export default function Destacados() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Destacadas"subtitle="Las pizzas que hacen que nuestros clientes vuelvan una y otra vez."/>
      <MostOrdered />
      <ProductModal />
      <CartSheet />
    </div>
  )
}
