import { FullMenu } from '@/components/full-menu'
import { Header } from '@/components/header'
import { ProductModal } from '@/components/product-modal'
import { CartSheet } from '@/components/cart-sheet'
import { CartProvider } from '@/lib/cart-context'
import { ProductUIProvider } from '@/lib/product-ui-context'

export default function Menu() {
  return (
    <CartProvider>
      <ProductUIProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16">
            <FullMenu />
          </main>
          <ProductModal />
          <CartSheet />
        </div>
      </ProductUIProvider>
    </CartProvider>
  )
}
