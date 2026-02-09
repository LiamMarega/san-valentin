import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Privacy Policy - ValentineDayLetter",
  description: "Privacy Policy for ValentineDayLetter. How we collect and use your information.",
}

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last Updated: February 2024
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground">
          <p>
            At ValentineDayLetter, operated by Liam Marega, we take your privacy seriously. This policy describes how we collect and use your information.
          </p>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>User Data:</strong> Name and email of the sender and recipient to provide the service.</li>
              <li><strong>Payment Data:</strong> We do not store credit card details. All payments are processed securely by Paddle (our Merchant of Record).</li>
              <li><strong>Usage Data:</strong> IP addresses and cookies for basic site functionality and security.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              2. How We Use Your Information
            </h2>
            <p>
              We use your data strictly to generate and send the digital letters you create. We do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              3. Data Retention
            </h2>
            <p>
              Letters and recipient emails are stored in our secure database (Neon DB) only as long as necessary to fulfill the service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              4. Your Rights
            </h2>
            <p>
              You may request the deletion of your data at any time by contacting us at{" "}
              <a href="mailto:liammaregadevelop@gmail.com" className="text-primary hover:underline">
                liammaregadevelop@gmail.com
              </a>.
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
