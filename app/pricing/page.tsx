import Link from "next/link"
import { ArrowLeft, Heart, Sparkles } from "lucide-react"

export const metadata = {
  title: "Precios - ValentineDayLetter",
  description: "Precios y planes de ValentineDayLetter. Plan gratuito y Carta PRO con temas premium y envío programado.",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12 pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">
          Precios
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Modelo simple: pago por carta. Sin suscripciones.
        </p>

        <div className="space-y-8">
          {/* Plans */}
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-primary" fill="currentColor" />
                <h2 className="font-serif text-lg font-semibold text-foreground">Plan Gratis</h2>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">$0</p>
              <p className="text-sm text-muted-foreground mb-4">Siempre gratis</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 1 tema básico</li>
                <li>• Envío inmediato por email</li>
                <li>• Previsualización en vivo</li>
              </ul>
              <Link
                href="/"
                className="mt-6 inline-flex w-full justify-center items-center border border-border text-foreground font-medium py-2.5 px-4 rounded-lg hover:bg-secondary transition-colors text-sm"
              >
                Crear carta gratis
              </Link>
            </div>

            <div className="bg-card rounded-2xl border border-primary/30 p-6 relative">
              <div className="absolute top-3 right-3">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">PRO</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-foreground">Carta PRO</h2>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">$1.00 USD</p>
              <p className="text-sm text-muted-foreground mb-4">Pago único por carta</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Temas premium (animaciones y diseños exclusivos)</li>
                <li>• Subida de foto en la carta</li>
                <li>• Envío programado (elige fecha y hora)</li>
              </ul>
              <Link
                href="/"
                className="mt-6 inline-flex w-full justify-center items-center bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-colors text-sm"
              >
                Crear carta PRO
              </Link>
            </div>
          </section>

          {/* How it works */}
          <section className="pt-6 border-t border-border">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Cómo funciona el sistema de precios</h2>
            <div className="space-y-4 text-muted-foreground text-sm">
              <p>
                <strong className="text-foreground">Pay-per-letter (pago por carta):</strong> No hay suscripciones ni cuotas mensuales. Creas tu carta, eliges si quieres el tema básico (gratis) o un tema PRO ($1.00 USD), y pagas solo cuando eliges PRO.
              </p>
              <p>
                <strong className="text-foreground">Plan Gratis:</strong> Puedes enviar cartas con el tema básico sin costo. La carta se envía de inmediato al correo del destinatario.
              </p>
              <p>
                <strong className="text-foreground">Carta PRO:</strong> Si eliges un tema PRO, se te pedirá un pago único de $1.00 USD por esa carta. Incluye temas con animaciones CSS/SVG, opción de subir una foto y programar el envío para una fecha y hora concretas (ideal para San Valentín).
              </p>
              <p>
                Los pagos se procesan de forma segura a través de Paddle (Merchant of Record). No guardamos datos de tarjeta. Para reembolsos y condiciones, consulta nuestra{" "}
                <Link href="/refund" className="text-primary hover:underline">Refund Policy</Link> y{" "}
                <Link href="/terms" className="text-primary hover:underline">Terms &amp; Conditions</Link>.
              </p>
            </div>
          </section>
        </div>

        <footer className="mt-12 pt-8 border-t border-border text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <p className="text-sm text-muted-foreground">© 2024 ValentineDayLetter by Liam Marega</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            <Link href="/pricing" className="hover:underline">Precios</Link>
            <Link href="/terms" className="hover:underline">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/refund" className="hover:underline">Refund Policy</Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
