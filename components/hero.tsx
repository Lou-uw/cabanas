'use client'

import Image from 'next/image'
import { MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-pizza.png"
          alt="Pizza artesanal recién horneada"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
          Pizzería · Ciudad del Este
        </span>

        <h1 className="max-w-3xl text-balance font-serif text-5xl font-black leading-[0.95] sm:text-6xl md:text-7xl">
          Pedí. Compartí. <span className="text-primary">Disfrutá.</span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Un refugio para los amantes de la buena pizza. Masa artesanal, ingredientes
          frescos y ese sabor de la cabaña que te hace volver.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            nativeButton={false}
            render={<a href="#menu">Ver el menú</a>}
            size="lg"
            className="rounded-full px-8 text-base font-semibold"
          />
          <Button
            nativeButton={false}
            render={<a href="#combo">Combo del día</a>}
            size="lg"
            variant="outline"
            className="rounded-full border-border bg-background/40 px-8 text-base font-semibold backdrop-blur"
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-primary" aria-hidden />
            Ciudad del Este, Paraguay
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-primary" aria-hidden />
            Delivery de 18:00 a 23:30
          </span>
        </div>
      </div>
    </section>
  )
}
