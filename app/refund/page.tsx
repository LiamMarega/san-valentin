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
          Last Updated: February 2026
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground">
          <p>
            Our orders are processed by Paddle.com, our Merchant of Record and authorised reseller. The following
            information summarises how refunds work for purchases made through Paddle.
          </p>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              1. Right to Cancel (Consumers)
            </h2>
            <p>
              If you are a Consumer, you may have the right to cancel your purchase and request a refund within{" "}
              <strong>30 days</strong> from the day after the Transaction is completed. To exercise this right, you must clearly inform Paddle
              (or us, so we can pass it on) of your decision to cancel within this 30-day period.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              2. Technical Issues and Duplicate Charges
            </h2>
            <p>
              Independently of the above, refunds may be granted if:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>There is a technical error in our platform that prevents the letter from being generated or sent.</li>
              <li>A duplicate charge has occurred.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              4. How to Request a Refund
            </h2>
            <p>
              For purchases processed by Paddle, refunds are ultimately handled at Paddle&apos;s discretion and in
              accordance with their consumer terms. If you experience technical issues or believe you are entitled to a
              refund, please contact{" "}
              <a href="mailto:liammaregadevelop@gmail.com" className="text-primary hover:underline">
                liammaregadevelop@gmail.com
              </a>{" "}
              or reach out directly to Paddle through their support channels. To help locate your order, please include the
              email used at checkout and, if possible, your transaction ID or receipt.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              5. Merchant of Record
            </h2>
            <p>
              Our order process is conducted by our online reseller Paddle.com. Paddle is the Merchant of Record for all our
              orders and is responsible for payment processing, billing, applicable taxes and issuing refunds in line with
              their{" "}
              <a
                href="https://www.paddle.com/legal/invoiced-consumer-terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Invoiced Consumer Terms and Conditions
              </a>
              .
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
          <p className="text-sm text-muted-foreground">
            © 2026 ValentineDayLetter by{" "}
            <Link
              href="https://www.instagram.com/liammdev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              @LiammDev
            </Link>
          </p>
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
