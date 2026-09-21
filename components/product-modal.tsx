'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { BORDES, formatGs, type SizeKey } from '@/lib/menu'
import { useProductUI } from '@/lib/product-ui-context'
import { useCart } from '@/lib/cart-context'

export function ProductModal() {
  const { selected, closeProduct } = useProductUI()
  const { addItem, openCart } = useCart()

  const [sizeKey, setSizeKey] = useState<SizeKey | null>(null)
  const [bordeId, setBordeId] = useState<string>('sin')
  const [quantity, setQuantity] = useState(1)

  // Reset the form whenever a new product opens.
  useEffect(() => {
    if (selected) {
      setSizeKey(selected.sizes?.[0]?.key ?? null)
      setBordeId('sin')
      setQuantity(1)
    }
  }, [selected])

  const selectedSize = useMemo(
    () => selected?.sizes?.find((s) => s.key === sizeKey) ?? null,
    [selected, sizeKey],
  )
  const selectedBorde = useMemo(
    () => BORDES.find((b) => b.id === bordeId) ?? BORDES[0],
    [bordeId],
  )

  const unitPrice = useMemo(() => {
    if (!selected) return 0
    const base = selected.sizes ? (selectedSize?.price ?? 0) : (selected.price ?? 0)
    const bordeExtra = selected.allowBorde ? selectedBorde.price : 0
    return base + bordeExtra
  }, [selected, selectedSize, selectedBorde])

  if (!selected) return null

  const handleAdd = () => {
    addItem({
      productId: selected.id,
      name: selected.name,
      image: selected.image,
      sizeLabel: selectedSize?.label,
      bordeLabel:
        selected.allowBorde && selectedBorde.price > 0
          ? selectedBorde.label
          : undefined,
      unitPrice,
      quantity,
    })
    closeProduct()
    openCart()
  }

  return (
    <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && closeProduct()}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={selected.image || '/placeholder.svg'}
            alt={selected.name}
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>

        <div className="p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="font-serif text-2xl font-bold">
              {selected.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selected.description}
            </DialogDescription>
          </DialogHeader>

          {selected.ingredients.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                >
                  {ing}
                </span>
              ))}
            </div>
          )}

          {selected.sizes && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Elegí el tamaño</p>
              <RadioGroup
                value={sizeKey ?? undefined}
                onValueChange={(v) => setSizeKey(v as SizeKey)}
                className="gap-2"
              >
                {selected.sizes.map((size) => (
                  <Label
                    key={size.key}
                    htmlFor={`size-${size.key}`}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-background/50 p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                  >
                    <span className="flex items-center gap-3">
                      <RadioGroupItem id={`size-${size.key}`} value={size.key} />
                      <span className="font-medium">{size.label}</span>
                    </span>
                    <span className="font-serif font-semibold text-primary">
                      {formatGs(size.price)}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {selected.allowBorde && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Borde relleno</p>
              <RadioGroup value={bordeId} onValueChange={setBordeId} className="gap-2">
                {BORDES.map((borde) => (
                  <Label
                    key={borde.id}
                    htmlFor={`borde-${borde.id}`}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-background/50 p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                  >
                    <span className="flex items-center gap-3">
                      <RadioGroupItem id={`borde-${borde.id}`} value={borde.id} />
                      <span className="font-medium">{borde.label}</span>
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {borde.price > 0 ? `+${formatGs(borde.price)}` : '—'}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-semibold">Cantidad</p>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="size-9 rounded-full"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Quitar una unidad"
              >
                <Minus className="size-4" aria-hidden />
              </Button>
              <span className="w-6 text-center font-serif text-lg font-bold" aria-live="polite">
                {quantity}
              </span>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="size-9 rounded-full"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Agregar una unidad"
              >
                <Plus className="size-4" aria-hidden />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleAdd}
            size="lg"
            className="mt-6 w-full gap-2 rounded-full text-base font-semibold"
          >
            <Check className="size-5" aria-hidden />
            Agregar · {formatGs(unitPrice * quantity)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
