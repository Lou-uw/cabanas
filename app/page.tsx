'use client'

import { CartProvider } from '@/lib/cart-context'
import { ProductUIProvider } from '@/lib/product-ui-context'
import { Hero } from '@/components/hero'
import { PromoSection } from '@/components/promo-section'
import { ProductModal } from '@/components/product-modal'
import { CartSheet } from '@/components/cart-sheet'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Flame, MapPin, Clock } from 'lucide-react'
import { FullMenu } from '@/components/full-menu'
import { PageHeader } from '@/components/page-header'
import { AboutFooter } from '@/components/about-footer'
import { MostOrdered } from '@/components/most-ordered'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <MostOrdered/>
      <div className="min-h-screen bg-background">
            <FullMenu />
            <ProductModal />
            <CartSheet />
          </div>
      <PromoSection />
      <AboutFooter />
    </div>
  )
}
