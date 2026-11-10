'use client'

import { PageHeader } from '@/components/page-header'
import { AboutFooter } from '@/components/about-footer'
import { CartSheet } from '@/components/cart-sheet'

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Nosotros"
        subtitle="Ubicación, horario y contacto de D&apos;Cabañas."
      />
      <AboutFooter />
      <CartSheet />
    </div>
  )
}
