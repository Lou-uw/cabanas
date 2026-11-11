'use client'

import { Hero } from '@/components/hero'
import { PromoSection } from '@/components/promo-section'
import { ProductModal } from '@/components/product-modal'
import { CartSheet } from '@/components/cart-sheet'
import { FullMenu } from '@/components/full-menu'
import { AboutFooter } from '@/components/about-footer'
import { MostOrdered } from '@/components/most-ordered'
import { BordesSection } from '@/components/bordes-section'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <MostOrdered />
      <FullMenu />
      <BordesSection />
      <PromoSection />
      <AboutFooter />
      <ProductModal />
      <CartSheet />
    </div>
  )
}