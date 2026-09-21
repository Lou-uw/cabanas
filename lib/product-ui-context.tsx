'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Product } from './menu'

type ProductUIContextValue = {
  selected: Product | null
  openProduct: (product: Product) => void
  closeProduct: () => void
}

const ProductUIContext = createContext<ProductUIContextValue | null>(null)

export function ProductUIProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Product | null>(null)
  return (
    <ProductUIContext.Provider
      value={{
        selected,
        openProduct: setSelected,
        closeProduct: () => setSelected(null),
      }}
    >
      {children}
    </ProductUIContext.Provider>
  )
}

export function useProductUI(): ProductUIContextValue {
  const ctx = useContext(ProductUIContext)
  if (!ctx) throw new Error('useProductUI must be used within a ProductUIProvider')
  return ctx
}
