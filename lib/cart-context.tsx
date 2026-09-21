'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  /** Unique per configured line (product + size + borde) */
  lineId: string
  productId: string
  name: string
  image: string
  sizeLabel?: string
  bordeLabel?: string
  unitPrice: number
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  addItem: (item: Omit<CartItem, 'lineId'> & { lineId?: string }) => void
  removeItem: (lineId: string) => void
  updateQuantity: (lineId: string, quantity: number) => void
  clear: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function makeLineId(
  productId: string,
  sizeLabel?: string,
  bordeLabel?: string,
): string {
  return [productId, sizeLabel ?? '', bordeLabel ?? ''].join('|')
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback<CartContextValue['addItem']>((incoming) => {
    const lineId =
      incoming.lineId ??
      makeLineId(incoming.productId, incoming.sizeLabel, incoming.bordeLabel)

    setItems((prev) => {
      const existing = prev.find((it) => it.lineId === lineId)
      if (existing) {
        return prev.map((it) =>
          it.lineId === lineId
            ? { ...it, quantity: it.quantity + incoming.quantity }
            : it,
        )
      }
      return [...prev, { ...incoming, lineId }]
    })
  }, [])

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((it) => it.lineId !== lineId))
  }, [])

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.lineId === lineId ? { ...it, quantity } : it))
        .filter((it) => it.quantity > 0),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const count = useMemo(
    () => items.reduce((acc, it) => acc + it.quantity, 0),
    [items],
  )
  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0),
    [items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      isOpen,
      openCart,
      closeCart,
    }),
    [items, count, total, addItem, removeItem, updateQuantity, clear, isOpen, openCart, closeCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
