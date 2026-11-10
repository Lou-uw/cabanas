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

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <PromoSection />

      <section id="acceso-rapido" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Acceso rápido
          </span>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            Elige cómo pedir
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/destacados"
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card transition-all hover:border-primary/40"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            <div className="flex h-full items-end p-6">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  <Flame className="size-3" /> Populares
                </span>
                <h3 className="mt-2 font-serif text-xl font-bold">Lo más pedido</h3>
                <p className="mt-1 text-sm text-muted-foreground">Pizzas favoritas</p>
              </div>
            </div>
          </Link>

          <Link
            href="/menu"
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card transition-all hover:border-primary/40"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            <div className="flex h-full items-end p-6">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  <ShoppingBag className="size-3" /> Catálogo
                </span>
                <h3 className="mt-2 font-serif text-xl font-bold">Menú completo</h3>
                <p className="mt-1 text-sm text-muted-foreground">Todas las categorías</p>
              </div>
            </div>
          </Link>

          <Link
            href="/promos"
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card transition-all hover:border-primary/40"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            <div className="flex h-full items-end p-6">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  <MapPin className="size-3" /> Ofertas
                </span>
                <h3 className="mt-2 font-serif text-xl font-bold">Promos del día</h3>
                <p className="mt-1 text-sm text-muted-foreground">Descuentos y regalos</p>
              </div>
            </div>
          </Link>

          <Link
            href="/nosotros"
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card transition-all hover:border-primary/40"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            <div className="flex h-full items-end p-6">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  <Clock className="size-3" /> Local
                </span>
                <h3 className="mt-2 font-serif text-xl font-bold">Nosotros</h3>
                <p className="mt-1 text-sm text-muted-foreground">Ubicación y contacto</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <ProductModal />
      <CartSheet />
    </div>
  )
}
