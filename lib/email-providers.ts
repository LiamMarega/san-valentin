import { Resend } from "resend"
import nodemailer from "nodemailer"

// ============ PROVIDER 1: RESEND (100/día) ============
const resend = new Resend(process.env.RESEND_API_KEY)

async function sendWithResend(
  from: string,
  to: string,
  subject: string,
  html: string
) {
  const { error } = await resend.emails.send({ from, to, subject, html })
  if (error) throw new Error(`Resend: ${error.message}`)
  return { provider: "resend" as const }
}

// ============ PROVIDER 2: BREVO (300/día) ============
async function sendWithBrevo(
  from: string,
  to: string,
  subject: string,
  html: string
) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) throw new Error("Brevo: BREVO_API_KEY not configured")

  // Parse "Name <email>" format
  const fromMatch = from.match(/^(.+?)\s*<(.+?)>$/)
  const senderName = fromMatch ? fromMatch[1].trim() : "Carta Secreta"
  const senderEmail = fromMatch ? fromMatch[2] : from

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Brevo: ${res.status} - ${err}`)
  }
  return { provider: "brevo" as const }
}

// ============ PROVIDER 3: GMAIL SMTP (~500/día) ============
let gmailTransport: nodemailer.Transporter | null = null

function getGmailTransport() {
  if (gmailTransport) return gmailTransport
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) throw new Error("Gmail: GMAIL_USER or GMAIL_APP_PASSWORD not configured")

  gmailTransport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  })
  return gmailTransport
}

async function sendWithGmail(
  _from: string,
  to: string,
  subject: string,
  html: string
) {
  const transport = getGmailTransport()
  await transport.sendMail({
    from: `"Carta Secreta" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  })
  return { provider: "gmail" as const }
}

// ============ PROVIDER 4: MAILJET (200/día) ============
async function sendWithMailjet(
  from: string,
  to: string,
  subject: string,
  html: string
) {
  const apiKey = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY
  if (!apiKey || !secretKey) throw new Error("Mailjet: API keys not configured")

  const fromMatch = from.match(/^(.+?)\s*<(.+?)>$/)
  const senderName = fromMatch ? fromMatch[1].trim() : "Carta Secreta"
  const senderEmail = fromMatch ? fromMatch[2] : from

  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64")

  const res = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: senderEmail, Name: senderName },
          To: [{ Email: to }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Mailjet: ${res.status} - ${err}`)
  }
  return { provider: "mailjet" as const }
}

// ============ FALLBACK SYSTEM ============

type SendFn = (from: string, to: string, subject: string, html: string) => Promise<{ provider: string }>

interface Provider {
  name: string
  send: SendFn
}

const providers: Provider[] = [
  { name: "resend", send: sendWithResend },
  { name: "brevo", send: sendWithBrevo },
  { name: "gmail", send: sendWithGmail },
  { name: "mailjet", send: sendWithMailjet },
]

function isRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const msg = error.message.toLowerCase()
  return (
    msg.includes("rate") ||
    msg.includes("limit") ||
    msg.includes("quota") ||
    msg.includes("429") ||
    msg.includes("daily") ||
    msg.includes("exceeded")
  )
}

export async function sendEmailWithFallback(
  from: string,
  to: string,
  subject: string,
  html: string
): Promise<{ provider: string }> {
  const errors: string[] = []

  for (const provider of providers) {
    try {
      const result = await provider.send(from, to, subject, html)
      console.log(`[email] Sent with ${result.provider}`)
      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)

      if (isRateLimitError(error)) {
        console.warn(`[email] ${provider.name} rate limited, trying next...`)
      } else if (message.includes("not configured")) {
        console.log(`[email] ${provider.name} not configured, skipping`)
      } else {
        console.error(`[email] ${provider.name} failed:`, message)
      }

      errors.push(`${provider.name}: ${message}`)
    }
  }

  throw new Error(`All email providers failed:\n${errors.join("\n")}`)
}
