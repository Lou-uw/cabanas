import { FullMenu } from "@/components/full-menu";
import { CartProvider } from "@/lib/cart-context";
import { ProductUIProvider } from "@/lib/product-ui-context";

export default function Menu(){



      return      (
      
        <CartProvider>
            <ProductUIProvider>
                <FullMenu />
            </ProductUIProvider>
        </CartProvider>
      )
}