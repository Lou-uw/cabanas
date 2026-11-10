'use client'

import Image from 'next/image'
import { formatGs } from '@/lib/menu'
import { useTamanio } from '@/hooks/useTamanio'

const OPTIONS = [
  { name: 'Catupiry', desc: 'Cremoso y suave, el clásico brasileño.' },
  { name: 'Cheddar', desc: 'Intenso y bien quesudo.' },
  { name: 'Chocolate', desc: 'Para transformar tu pizza en postre.' },
]

export function BordesSection() {
  const { tamanios, loading, error } = useTamanio()

  return (
    <section className="relative overflow-hidden border-y border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
        <div className="relative order-last aspect-square overflow-hidden rounded-3xl border border-border lg:order-first">
          <Image
            src="/images/bordes.png"
            alt="Borde de pizza relleno de queso derretido"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Sumale magia
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
            Bordes rellenos
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Convertí cualquier pizza en una experiencia. Elegí tu borde relleno
            favorito; el precio depende del tamaño de la pizza.
          </p>

          <ul className="mt-8 space-y-4">
            {OPTIONS.map((opt) => (
              <li
                key={opt.name}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/50 p-4"
              >
                <div>
                  <p className="font-serif text-lg font-semibold">{opt.name}</p>
                  <p className="text-sm text-muted-foreground">{opt.desc}</p>
                </div>
                <span className="shrink-0 text-sm text-muted-foreground">
                  según el tamaño
                </span>
              </li>
            ))}
          </ul>

          {!loading && !error && tamanios.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-background/50 p-4">
              <p className="text-sm font-semibold">Precio del borde por tamaño</p>
              <ul className="mt-3 space-y-2 text-sm">
                {tamanios.map((tamanio) => (
                  <li
                    key={tamanio.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted-foreground">
                      {tamanio.nombre}
                    </span>
                    <span className="font-serif font-bold text-primary">
                      +{formatGs(tamanio.precioBorde)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
