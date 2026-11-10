export const url_api =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8080/api/'

// Número de WhatsApp del local (formato internacional, sin +).
// Se puede cambiar acá o con NEXT_PUBLIC_WHATSAPP_NUMBER.
export const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '595973493374'

export const whatsappUrl = `https://wa.me/${whatsappNumber}`

// Cómo se muestra el número en pantalla.
export const whatsappDisplay = '+595 973 493 374'
