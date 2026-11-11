'use client'

import Link from 'next/link'
import { ArrowLeft, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" />
          <span className="text-sm font-medium">Volver al inicio</span>
        </Link>
      </div>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">{title}</h1>
        {subtitle && <p className="max-w-xl text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  )
}

export function LogoLink() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Flame className="size-5" aria-hidden />
      </span>
      <span className="font-serif text-lg font-bold leading-none tracking-tight">
        D&apos;Cabañas
      </span>
    </Link>
  )
}
