import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Refund Policy - ValentineDayLetter",
  description: "Refund Policy for ValentineDayLetter. Information about refunds for digital products.",
}

export default function RefundPage() {
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
          Refund Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last Updated: February 2024
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground">
          <p>
            Due to the nature of digital goods, ValentineDayLetter has a specific refund policy:
          </p>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              1. Digital Products
            </h2>
            <p>
              Since our PRO letters are digital content delivered immediately or upon a scheduled date, we generally do not offer refunds once the payment is confirmed and the letter is processed.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              2. Exceptions
            </h2>
            <p>
              We will issue a full refund if:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>There is a technical error in our platform that prevents the letter from being generated or sent.</li>
              <li>A duplicate charge has occurred due to a technical glitch.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              3. How to Request a Refund
            </h2>
            <p>
              If you experience technical issues, please contact{" "}
              <a href="mailto:liammaregadevelop@gmail.com" className="text-primary hover:underline">
                liammaregadevelop@gmail.com
              </a>{" "}
              within 7 days of purchase with your transaction ID.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              4. Merchant of Record
            </h2>
            <p>
              Our order process is conducted by our online reseller Paddle.com. Paddle is the Merchant of Record for all our orders.
            </p>
          </section>
        </article>

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
            <Link href="/terms" className="hover:underline">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/refund" className="hover:underline">Refund Policy</Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
