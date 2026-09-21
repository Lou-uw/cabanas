'use client'

import { useEffect, useState } from 'react'
import { Flame, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'

const NAV_LINKS = [
  { href: '#destacados', label: 'Destacados' },
  { href: '#menu', label: 'Menú' },
  { href: '#combo', label: 'Combo' },
  { href: '#nosotros', label: 'Nosotros' },
]

export function Header() {
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-border bg-background/85 backdrop-blur-md'
          : 'border-b border-transparent bg-gradient-to-b from-background/80 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Flame className="size-5" aria-hidden />
          </span>
          <span className="font-serif text-lg font-bold leading-none tracking-tight">
            D&apos;Cabañas
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button
          onClick={openCart}
          variant="secondary"
          className="relative gap-2 rounded-full"
        >
          <ShoppingBag className="size-4" aria-hidden />
          <span className="hidden sm:inline">Mi pedido</span>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}
