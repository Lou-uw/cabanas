'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, Check } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { formatGs } from '@/lib/menu'
import { useCart } from '@/lib/cart-context'
import { crearPedido } from '@/services/PedidoService'
import { whatsappNumber } from '@/config'

type Payment = 'efectivo' | 'transferencia' | 'tarjeta'

type CompletedOrder = {
  id: number
  total: number
  whatsappUrl: string
  /** true si pudimos cargar la ventana de WhatsApp que abrimos en el clic */
  opened: boolean
}

export function CartSheet() {
  const { items, total, count, isOpen, closeCart, updateQuantity, removeItem, clear } =
    useCart()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState<Payment>('efectivo')
  const [notes, setNotes] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null)

  // El negocio es solo delivery: la dirección es obligatoria.
  const canSubmit =
    items.length > 0 &&
    !submitting &&
    !completedOrder &&
    name.trim().length > 1 &&
    address.trim().length > 3

  const buildMessage = (orderId?: number, totalPedido?: number) => {
    const lines: string[] = []
    lines.push('*Nuevo pedido - D\u2019Cabañas*')
    if (orderId) lines.push(`*Pedido #${orderId}*`)
    lines.push('')
    lines.push(`*Cliente:* ${name.trim()}`)
    if (phone.trim()) {
      lines.push(`*Teléfono:* ${phone.trim()}`)
    }
    lines.push(`*Dirección:* ${address.trim()}`)
    lines.push(
      `*Pago:* ${
        payment === 'efectivo'
          ? 'Efectivo'
          : payment === 'transferencia'
            ? 'Transferencia'
            : 'Tarjeta'
      }`,
    )
    lines.push('')
    lines.push('*Detalle del pedido:*')
    items.forEach((it) => {
      const extras = [it.sizeLabel, it.bordeLabel].filter(Boolean).join(' · ')
      const label = extras ? `${it.name} (${extras})` : it.name
      const regaloPrefix = it.esRegalo ? 'Regalo: ' : ''
      lines.push(
        `• ${it.quantity} x ${regaloPrefix}${label} — ${formatGs(it.unitPrice * it.quantity)}`,
      )
    })
    lines.push('')
    lines.push(`*Total: ${formatGs(totalPedido ?? total)}*`)
    if (notes.trim()) {
      lines.push('')
      lines.push(`*Notas:* ${notes.trim()}`)
    }
    return lines.join('\n')
  }

  const handleCheckout = async () => {
    if (canSubmit === false) return
    if (submittingRef.current) return
    submittingRef.current = true
    setOrderError(null)

    // Abrimos la ventana en el mismo clic para que el navegador no la bloquee.
    // No usamos "noopener" acá porque necesitamos la referencia para cargar el link.
    const whatsappWindow = window.open('', '_blank')
    if (whatsappWindow) {
      whatsappWindow.opener = null
    }

    setSubmitting(true)

    try {
      const pedido = await crearPedido({
        clienteNombre: name.trim(),
        clienteTelefono: phone.trim() || null,
        formaPago: payment,
        direccionEntrega: address.trim(),
        notas: notes.trim() || null,
        detalles: items.map((it) => ({
          productoId: Number(it.productId),
          tamanioId: it.tamanioId,
          conBorde: it.conBorde ?? false,
          esRegalo: it.esRegalo ?? false,
          cantidad: it.quantity,
        })),
      })

      const mensaje = buildMessage(pedido.id, Number(pedido.total))
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`

      const opened = Boolean(whatsappWindow && !whatsappWindow.closed)
      if (opened && whatsappWindow) {
        whatsappWindow.location.href = url
      }

      setCompletedOrder({
        id: pedido.id,
        total: Number(pedido.total),
        whatsappUrl: url,
        opened,
      })
      clear()
    } catch (error) {
      // Si no se pudo guardar, cerramos la ventana en blanco y no enviamos nada.
      whatsappWindow?.close()
      setOrderError(
        error instanceof Error ? error.message : 'No se pudo guardar el pedido.',
      )
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (open) return
    closeCart()
    if (completedOrder) {
      clear()
      setCompletedOrder(null)
      setOrderError(null)
    }
  }

  const closeCompletedOrder = () => {
    setCompletedOrder(null)
    setOrderError(null)
    closeCart()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="flex items-center gap-2 font-serif text-xl">
            {completedOrder ? (
              <Check className="size-5 text-primary" aria-hidden />
            ) : (
              <ShoppingBag className="size-5 text-primary" aria-hidden />
            )}
            {completedOrder ? 'Pedido confirmado' : 'Tu pedido'}
          </SheetTitle>
          <SheetDescription>
            {completedOrder
              ? 'Tu pedido quedó guardado correctamente.'
              : count > 0
                ? `${count} ${count === 1 ? 'artículo' : 'artículos'} en el carrito`
                : 'Todavía no agregaste nada.'}
          </SheetDescription>
        </SheetHeader>

        {completedOrder ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="size-8" aria-hidden />
            </div>
            <p className="font-serif text-2xl font-bold">
              Pedido #{completedOrder.id}
            </p>
            <p className="text-muted-foreground">
              Total: {formatGs(completedOrder.total)}
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              {completedOrder.opened
                ? 'Abrimos WhatsApp con el detalle de tu pedido. Si no se abrió, usá el botón.'
                : 'No pudimos abrir WhatsApp automáticamente. Usá el botón para enviarlo.'}
            </p>

            <Button
              onClick={() =>
                window.open(
                  completedOrder.whatsappUrl,
                  '_blank',
                  'noopener,noreferrer',
                )
              }
              size="lg"
              className="mt-2 w-full gap-2 rounded-full text-base font-semibold"
            >
              <MessageCircle className="size-5" aria-hidden />
              Abrir WhatsApp
            </Button>
            <Button
              onClick={closeCompletedOrder}
              variant="outline"
              size="lg"
              className="w-full rounded-full"
            >
              Cerrar
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-7 text-muted-foreground" aria-hidden />
            </div>
            <p className="font-serif text-lg font-semibold">Tu carrito está vacío</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Explorá el menú y sumá tus pizzas favoritas para hacer tu pedido.
            </p>
            <Button onClick={closeCart} variant="secondary" className="mt-2 rounded-full">
              Ver el menú
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {items.map((it) => (
                <div
                  key={it.lineId}
                  className="flex gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={it.image || '/placeholder.svg'}
                      alt={it.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <p className="truncate font-semibold leading-tight">{it.name}</p>
                        {it.esRegalo && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary text-primary-foreground">
                            Regalo
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(it.lineId)}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Eliminar ${it.name}`}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                    {(it.sizeLabel || it.bordeLabel) && (
                      <p className="truncate text-xs text-muted-foreground">
                        {[it.sizeLabel, it.bordeLabel].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="size-7 rounded-full"
                          onClick={() => updateQuantity(it.lineId, it.quantity - 1)}
                          aria-label="Quitar una unidad"
                        >
                          <Minus className="size-3.5" aria-hidden />
                        </Button>
                        <span className="w-5 text-center text-sm font-semibold">
                          {it.quantity}
                        </span>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="size-7 rounded-full"
                          onClick={() => updateQuantity(it.lineId, it.quantity + 1)}
                          aria-label="Agregar una unidad"
                        >
                          <Plus className="size-3.5" aria-hidden />
                        </Button>
                      </div>
                      <span className="font-serif font-semibold text-primary">
                        {formatGs(it.unitPrice * it.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <Separator className="my-4" />

              <div className="space-y-4">
                <p className="font-serif text-lg font-semibold">Datos de entrega</p>

                <div className="grid gap-1.5">
                  <Label htmlFor="cart-name">Nombre</Label>
                  <Input
                    id="cart-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="cart-phone">Teléfono</Label>
                  <Input
                    id="cart-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    inputMode="tel"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="cart-address">Dirección de entrega</Label>
                  <Input
                    id="cart-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, número y referencia"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label>Forma de pago</Label>
                  <RadioGroup
                    value={payment}
                    onValueChange={(v) => setPayment(v as Payment)}
                    className="grid grid-cols-3 gap-2"
                  >
                    {(
                      [
                        ['efectivo', 'Efectivo'],
                        ['transferencia', 'Transf.'],
                        ['tarjeta', 'Tarjeta'],
                      ] as const
                    ).map(([value, label]) => (
                      <Label
                        key={value}
                        htmlFor={`pay-${value}`}
                        className="flex cursor-pointer items-center justify-center rounded-xl border border-border bg-background/50 p-2.5 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                      >
                        <RadioGroupItem id={`pay-${value}`} value={value} className="sr-only" />
                        {label}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="cart-notes">Notas (opcional)</Label>
                  <Textarea
                    id="cart-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Sin cebolla, tocar timbre, etc."
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border bg-card/60 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-serif text-2xl font-black text-primary">
                  {formatGs(total)}
                </span>
              </div>

              {orderError && (
                <p className="mb-3 rounded-lg bg-destructive/10 p-2 text-sm text-destructive">
                  {orderError}
                </p>
              )}

              <Button
                onClick={handleCheckout}
                disabled={!canSubmit}
                size="lg"
                className="w-full gap-2 rounded-full text-base font-semibold"
              >
                <MessageCircle className="size-5" aria-hidden />
                {submitting ? 'Guardando pedido...' : 'Enviar pedido por WhatsApp'}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Tu pedido se guarda y se envía por WhatsApp al local.
              </p>
              <button
                type="button"
                onClick={clear}
                className="mt-3 w-full text-center text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
