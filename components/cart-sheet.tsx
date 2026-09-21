'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
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

// Número de WhatsApp de la pizzería (formato internacional, sin +)
const WHATSAPP_NUMBER = '595983123456'

type OrderType = 'delivery' | 'retiro'
type Payment = 'efectivo' | 'transferencia' | 'tarjeta'

export function CartSheet() {
  const { items, total, count, isOpen, closeCart, updateQuantity, removeItem, clear } =
    useCart()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [orderType, setOrderType] = useState<OrderType>('delivery')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState<Payment>('efectivo')
  const [notes, setNotes] = useState('')

  const canSubmit =
    items.length > 0 &&
    name.trim().length > 1 &&
    phone.trim().length >= 6 &&
    (orderType === 'retiro' || address.trim().length > 3)

  const buildMessage = () => {
    const lines: string[] = []
    lines.push('*Nuevo pedido - D\u2019Cabañas* 🍕')
    lines.push('')
    lines.push(`*Cliente:* ${name.trim()}`)
    lines.push(`*Teléfono:* ${phone.trim()}`)
    lines.push(`*Entrega:* ${orderType === 'delivery' ? 'Delivery' : 'Retiro en local'}`)
    if (orderType === 'delivery') {
      lines.push(`*Dirección:* ${address.trim()}`)
    }
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
      lines.push(
        `• ${it.quantity} x ${label} — ${formatGs(it.unitPrice * it.quantity)}`,
      )
    })
    lines.push('')
    lines.push(`*Total: ${formatGs(total)}*`)
    if (notes.trim()) {
      lines.push('')
      lines.push(`*Notas:* ${notes.trim()}`)
    }
    return lines.join('\n')
  }

  const handleCheckout = () => {
    if (!canSubmit) return
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="flex items-center gap-2 font-serif text-xl">
            <ShoppingBag className="size-5 text-primary" aria-hidden />
            Tu pedido
          </SheetTitle>
          <SheetDescription>
            {count > 0
              ? `${count} ${count === 1 ? 'artículo' : 'artículos'} en el carrito`
              : 'Todavía no agregaste nada.'}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
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
                      <p className="truncate font-semibold leading-tight">{it.name}</p>
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
                  <Label>Tipo de entrega</Label>
                  <RadioGroup
                    value={orderType}
                    onValueChange={(v) => setOrderType(v as OrderType)}
                    className="grid grid-cols-2 gap-2"
                  >
                    <Label
                      htmlFor="type-delivery"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background/50 p-3 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                    >
                      <RadioGroupItem id="type-delivery" value="delivery" className="sr-only" />
                      Delivery
                    </Label>
                    <Label
                      htmlFor="type-retiro"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background/50 p-3 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                    >
                      <RadioGroupItem id="type-retiro" value="retiro" className="sr-only" />
                      Retiro
                    </Label>
                  </RadioGroup>
                </div>

                {orderType === 'delivery' && (
                  <div className="grid gap-1.5">
                    <Label htmlFor="cart-address">Dirección</Label>
                    <Input
                      id="cart-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Calle, número y referencia"
                    />
                  </div>
                )}

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
              <Button
                onClick={handleCheckout}
                disabled={!canSubmit}
                size="lg"
                className="w-full gap-2 rounded-full text-base font-semibold"
              >
                <MessageCircle className="size-5" aria-hidden />
                Enviar pedido por WhatsApp
              </Button>
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
