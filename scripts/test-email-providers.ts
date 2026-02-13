import path from "path"
import { fileURLToPath } from "url"
import * as dotenv from "dotenv"

// Fix for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from project root
dotenv.config({ path: path.join(__dirname, "../.env") })

const testEmail = process.argv[2]
if (!testEmail) {
  console.error("Usage: npx tsx scripts/test-email-providers.ts <your-email>")
  process.exit(1)
}

const html = `<h2>Test email</h2><p>Si ves esto, el provider funciona correctamente.</p>`
const subject = "Test - Carta Secreta Provider"

// Parse "Name <email>" format from RESEND_FROM
const fromRaw = process.env.RESEND_FROM || "Carta Secreta <noreply@valentinedayletter.com>"
const fromMatch = fromRaw.match(/^(.+?)\s*<(.+?)>$/)
const senderName = fromMatch ? fromMatch[1].trim() : "Carta Secreta Test"
const senderEmail = fromMatch ? fromMatch[2] : (fromRaw.includes("@") ? fromRaw : "noreply@valentinedayletter.com")

// ============ TEST RESEND ============
async function testResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return console.log("RESEND: skipped (no API key)")

  const { Resend } = await import("resend")
  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({
      from: fromRaw,
      to: testEmail,
      subject: `${subject} (Resend)`,
      html,
    })

    if (error) {
      console.error(`RESEND: FAILED - ${error.message}`)
    } else {
      console.log("RESEND: OK")
    }
  } catch (err: any) {
    console.error(`RESEND: FAILED - ${err.message}`)
  }
}

// ============ TEST BREVO ============
async function testBrevo() {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) return console.log("BREVO: skipped (no API key)")

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: testEmail }],
      subject: `${subject} (Brevo)`,
      htmlContent: html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`BREVO: FAILED - ${res.status} ${err}`)
  } else {
    const data = await res.json()
    console.log("BREVO: OK", data.messageId ? `(ID: ${data.messageId})` : "")
  }
}

// ============ TEST GMAIL ============
async function testGmail() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return console.log("GMAIL: skipped (no credentials)")

  const nodemailer = await import("nodemailer")
  const transport = nodemailer.default.createTransport({
    service: "gmail",
    auth: { user, pass },
  })

  try {
    await transport.sendMail({
      from: `"${senderName}" <${user}>`,
      to: testEmail,
      subject: `${subject} (Gmail)`,
      html,
    })
    console.log("GMAIL: OK")
  } catch (err: any) {
    console.error(`GMAIL: FAILED - ${err.message}`)
  }
}

// ============ TEST MAILJET ============
async function testMailjet() {
  const apiKey = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY
  if (!apiKey || !secretKey) return console.log("MAILJET: skipped (no API keys)")

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
          To: [{ Email: testEmail }],
          Subject: `${subject} (Mailjet)`,
          HTMLPart: html,
        },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`MAILJET: FAILED - ${res.status} ${err}`)
  } else {
    const data = await res.json()
    const msg = data?.Messages?.[0]
    if (msg?.Status === "error") {
      console.error(`MAILJET: FAILED - ${JSON.stringify(msg.Errors)}`)
    } else {
      console.log(`MAILJET: OK (Status: ${msg?.Status})`)
    }
  }
}

// ============ RUN ALL ============
async function main() {
  console.log(`\nTesting email providers -> ${testEmail}`)
  console.log(`Using sender: ${senderName} <${senderEmail}>\n`)

  await testResend()
  await testBrevo()
  await testGmail()
  await testMailjet()

  console.log("\nDone. Check your inbox (and spam folder).")
}

main().catch(console.error)
