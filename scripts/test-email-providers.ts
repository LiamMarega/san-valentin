// Usage: npx tsx scripts/test-email-providers.ts tu-email@gmail.com
import "dotenv/config"

const testEmail = process.argv[2]
if (!testEmail) {
  console.error("Usage: npx tsx scripts/test-email-providers.ts <your-email>")
  process.exit(1)
}

const html = `<h2>Test email</h2><p>Si ves esto, el provider funciona correctamente.</p>`
const subject = "Test - Carta Secreta Provider"

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
      sender: { name: "Carta Secreta Test", email: "noreply@valentinedayletter.com" },
      to: [{ email: testEmail }],
      subject: `${subject} (Brevo)`,
      htmlContent: html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`BREVO: FAILED - ${res.status} ${err}`)
  } else {
    console.log("BREVO: OK")
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
      from: `"Carta Secreta Test" <${user}>`,
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
          From: { Email: "noreply@valentinedayletter.com", Name: "Carta Secreta Test" },
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
    const status = data?.Messages?.[0]?.Status
    if (status === "error") {
      console.error(`MAILJET: FAILED - ${JSON.stringify(data.Messages[0].Errors)}`)
    } else {
      console.log(`MAILJET: OK (status: ${status})`)
    }
  }
}

// ============ RUN ALL ============
async function main() {
  console.log(`\nTesting email providers -> ${testEmail}\n`)

  await testBrevo()
  await testGmail()
  await testMailjet()

  console.log("\nDone. Check your inbox (and spam folder).")
}

main().catch(console.error)
