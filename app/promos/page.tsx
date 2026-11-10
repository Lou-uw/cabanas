import { PageHeader } from '@/components/page-header'
import { PromoSection } from '@/components/promo-section'
import { CartSheet } from '@/components/cart-sheet'
import { obtenerPromoDia } from '@/services/PromoService'

export default async function PromosPage({
  searchParams,
}: {
  searchParams: Promise<{ dia?: string }>
}) {
  const params = await searchParams
  const diaForzado = params.dia

  let promo
  if (diaForzado) {
    promo = await obtenerPromoDia(diaForzado)
  } else {
    const respuesta = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8080/api/'}promos/hoy`,
      { cache: 'no-store' },
    )
    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al obtener la promo de hoy`)
    }
    promo = await respuesta.json()
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Promos del día"
        subtitle="Descuentos y regalos que cambian según el día de la semana."
      />
      <PromoSection promoInicial={promo} />
      <CartSheet />
    </div>
  )
}
