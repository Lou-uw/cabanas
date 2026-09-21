'use client'

import { CartProvider } from '@/lib/cart-context'
import { ProductUIProvider } from '@/lib/product-ui-context'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { MostOrdered } from '@/components/most-ordered'
import { BordesSection } from '@/components/bordes-section'
import { FullMenu } from '@/components/full-menu'
import { ComboSection } from '@/components/combo-section'
import { AboutFooter } from '@/components/about-footer'
import { ProductModal } from '@/components/product-modal'
import { CartSheet } from '@/components/cart-sheet'

export default function Page() {
  return (
    <CartProvider>
      <ProductUIProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Hero />
            <MostOrdered />
            <BordesSection />
            <FullMenu />
            <ComboSection />
          </main>
          <AboutFooter />
          <ProductModal />
          <CartSheet />
        </div>
      </ProductUIProvider>
    </CartProvider>
  )
}
