'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import type { PromoInfo } from '@/types/promo'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { formatGs } from '@/lib/menu'

// IDs de productos que pueden ser regalos (coinciden con el backend)
const PRODUCTO_PAPA_MEDIANA = 23
const PRODUCTO_COCACOLA_1L = 25

// Configuración de regalos por tipo de promo
const REGALOS_POR_PROMO: Record<string, { productoId: number; nombre: string; cantidad: number }[]> = {
  miercoles: [
    { productoId: PRODUCTO_PAPA_MEDIANA, nombre: 'Papas fritas mediana', cantidad: 1 },
  ],
  viernes: [
    { productoId: PRODUCTO_COCACOLA_1L, nombre: 'Coca-Cola 1 L', cantidad: 1 },
  ],
  fin_de_semana: [
    { productoId: PRODUCTO_COCACOLA_1L, nombre: 'Coca-Cola 1 L', cantidad: 1 },
    { productoId: PRODUCTO_PAPA_MEDIANA, nombre: 'Papas fritas mediana', cantidad: 1 },
  ],
}

const IMAGENES_PROMO: Record<string, string> = {
  miercoles: '/images/promo-miercoles.png',
  viernes: '/images/promo-viernes.png',
  fin_de_semana: '/images/promo-sabado-domingo.png',
}

const DIAS_SEMANA: Record<string, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
}

const PROXIMO_DIA_PROMO: Record<string, string> = {
  MONDAY: 'Miércoles',
  TUESDAY: 'Miércoles',
  WEDNESDAY: 'Viernes',
  THURSDAY: 'Viernes',
  FRIDAY: 'Sábado',
  SATURDAY: 'Domingo',
  SUNDAY: 'Miércoles',
}

function getDiaSemanaNombre(dia: string): string {
  return DIAS_SEMANA[dia] || dia
}

function getProximoDiaPromo(dia: string): string {
  return PROXIMO_DIA_PROMO[dia] || 'Miércoles'
}

function regaloNombre(productoId: number): string {
  const nombres: Record<number, string> = {
    23: 'Papas fritas mediana',
    25: 'Coca-Cola 1 L',
  }
  return nombres[productoId] ?? 'Regalo'
}

interface PromoSectionProps {
  /** Promo pre-cargada desde el servidor (para evitar problemas de hidratación) */
  promoInicial?: PromoInfo | null
}

export function PromoSection({ promoInicial }: PromoSectionProps) {
  const [promo, setPromo] = useState<PromoInfo | null>(promoInicial ?? null)
  const [loading, setLoading] = useState(!promoInicial)
  const [error, setError] = useState<string | null>(null)
  const { addItem, removeItem, items } = useCart()

  // Si no hay promo inicial (página principal sin día forzado), llamar al backend
  useEffect(() => {
    if (promoInicial) return

    let cancelled = false

    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8080/api/'}promos/hoy`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`)
        return respuesta.json()
      })
      .then((data: PromoInfo) => {
        if (!cancelled) {
          setPromo({ ...data, forzado: false })
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err))
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [promoInicial])

  // Determinar los regalos que debería tener el carrito según la promo activa y los ítems actuales
  const regalosEsperados = useMemo(() => {
    if (!promo?.hayPromoActiva || !promo.tipoPromo) return []

    // Contar pizzas por tamaño en el carrito (sin contar regalos)
    let pizzasGrande = 0
    let pizzasFamiliar = 0

    for (const it of items) {
      if (it.esRegalo) continue
      if (it.tamanioId === 2) pizzasGrande++
      if (it.tamanioId === 3) pizzasFamiliar++
    }

    const regalos = REGALOS_POR_PROMO[promo.tipoPromo]
    if (!regalos) return []

    switch (promo.tipoPromo) {
      case 'miercoles':
        if (pizzasGrande >= 1 || pizzasFamiliar >= 1) return regalos
        break
      case 'viernes':
        if (pizzasFamiliar >= 1) return regalos
        break
      case 'fin_de_semana':
        if (pizzasFamiliar >= 2) return regalos
        break
    }
    return []
  }, [promo, items])

  // Sincronizar regalos con el carrito: agregar los que faltan, quitar los que sobran
  useEffect(() => {
    if (!promo?.hayPromoActiva || !regalosEsperados.length) return

    const idsRegaloEnCarrito = new Set(
      items
        .filter((it) => it.esRegalo)
        .map((it) => `${it.productId}|${it.tamanioId ?? ''}`)
    )

    for (const regalo of regalosEsperados) {
      const key = `${regalo.productoId}|`
      if (!idsRegaloEnCarrito.has(key)) {
        addItem({
          productId: String(regalo.productoId),
          name: `🎁 Regalo: ${regaloNombre(regalo.productoId)}`,
          image: '/images///combo.png',
          ////comboId: undefined,
          tamanioId: undefined,
          conBorde: false,
          esRegalo: true,
          unitPrice: 0,
          quantity: regalo.cantidad,
          lineId: `regalo-${regalo.productoId}`,
        })
      }
    }
  }, [promo, regalosEsperados, items, addItem])

  // Quitar regalos del carrito si ya no hay promo activa
  useEffect(() => {
    if (promo?.hayPromoActiva) return
    const idsRegalo = items
      .filter((it) => it.esRegalo)
      .map((it) => it.lineId)
    for (const lineId of idsRegalo) {
      removeItem(lineId)
    }
  }, [promo?.hayPromoActiva, items, removeItem])

  if (loading) return null

  // Si hay error y no hay promo inicial, mostrar mensaje de error
  if (error && !promoInicial) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col items-center justify-center gap-3 p-8 text-center rounded-lg border border-destructive/50 bg-destructive/10">
          <p className="text-destructive">
            No se pudo cargar la promo del día. Verificá que el servidor esté encendido.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reintentar
          </Button>
        </div>
      </section>
    )
  }

  const diaNombre = promo?.diaSemana ? getDiaSemanaNombre(promo.diaSemana) : ''
  const tienePromo = promo?.hayPromoActiva || false

  return (
    <section id="promos" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-6 pb-16 sm:px-6 sm:pt-8 sm:pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
        <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2">
          <div>
            {tienePromo ? (
              <>
                <span className="inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                  Promo del día
                </span>
                <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
                  {diaNombre}
                </h2>
                <p className="mt-3 max-w-md text-muted-foreground">
                  {promo!.descripcion}
                </p>

                {regalosEsperados.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {regalosEsperados.map((r: any) => (
                      <div key={r.productoId} className="flex items-center gap-3 text-sm">
                        <span className="text-primary font-semibold">+</span>
                        <span className="text-muted-foreground">
                          {r.nombre} × {r.cantidad} de regalo
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Próxima promo
                </span>
                <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
                  {diaNombre}
                </h2>
                <p className="mt-3 max-w-md text-muted-foreground">
                  Hoy no hay promo activa. La próxima es{' '}
                  <span className="font-serif font-bold text-primary">
                    {getProximoDiaPromo(promo!.diaSemana ?? 'MONDAY')}
                  </span>
                  .
                </p>
              </>
            )}
          </div>

         <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            {tienePromo && promo!.tipoPromo ? (
              <Image
                src={IMAGENES_PROMO[promo!.tipoPromo] || '/images/combo.png'}
                alt={promo!.descripcion ?? 'Promo del día'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  ;(e.target as HTMLImageElement).src = '/images/combo.png'
                }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center rounded-2xl border border-border bg-muted"
              >
                <span className="text-muted-foreground text-sm">
                  Imagen no disponible
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
