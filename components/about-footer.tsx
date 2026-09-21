import { Flame, MapPin, Clock, Phone, AtSign } from 'lucide-react'

export function AboutFooter() {
  return (
    <footer id="nosotros" className="scroll-mt-20 border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Flame className="size-5" aria-hidden />
              </span>
              <span className="font-serif text-xl font-bold">D&apos;Cabañas</span>
            </div>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
              Nacimos como un refugio para los amantes de la buena pizza en Ciudad del
              Este. Masa fermentada con paciencia, ingredientes frescos y el fuego justo
              para que cada porción se sienta como estar en la cabaña. Pedí, compartí y
              disfrutá.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-semibold">Encontranos</h3>
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                Av. Monseñor Rodríguez, Ciudad del Este, Paraguay
              </p>
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                Todos los días de 18:00 a 23:30
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-lg font-semibold">Contacto</h3>
              <a
                href="https://wa.me/595983123456"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="size-4 shrink-0 text-primary" aria-hidden />
                +595 983 123 456
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <AtSign className="size-4 shrink-0 text-primary" aria-hidden />
                @dcabanas.pizza
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} D&apos;Cabañas Pizzería. Todos los derechos reservados.</p>
          <p>Hecho con fuego y muzzarella en Ciudad del Este.</p>
        </div>
      </div>
    </footer>
  )
}
