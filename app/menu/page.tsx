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
      />
      <FullMenu />
      <ProductModal />
      <CartSheet />
    </div>
  )
}
