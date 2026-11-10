export type PromoInfo = {
  fecha: string
  diaSemana: string
  hayPromoActiva: boolean
  tipoPromo: string | null
  descripcion: string | null
  imagen: string | null
  forzado?: boolean
}
