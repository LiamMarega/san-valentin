import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendLetterEmailParams {
  to: string
  senderName: string
  receiverName: string
  messageType: string
  letterId: string
}

export async function sendLetterEmail({
  to,
  senderName,
  receiverName,
  messageType,
  letterId,
}: SendLetterEmailParams) {
  // Prioridad: NEXT_PUBLIC_APP_URL (tu dominio) > VERCEL_URL (preview) > localhost
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_APP_URL
      : `https://${process.env.NEXT_PUBLIC_APP_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

  const letterUrl = `${baseUrl}/carta/${letterId}`

  // Diseño Moderno San Valentín
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Tienes una carta especial!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fff1f2; font-family: 'Helvetica', 'Arial', sans-serif;">
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff1f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(225, 29, 72, 0.15); border: 1px solid #fce7f3;">
          
          <tr>
            <td style="height: 8px; background: linear-gradient(90deg, #fda4af 0%, #e11d48 100%);"></td>
          </tr>

          <tr>
            <td style="padding: 40px 32px 20px 32px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px; line-height: 1;">
                💌
              </div>
              <h1 style="color: #881337; font-size: 24px; font-weight: 700; margin: 0; line-height: 1.3; font-family: 'Georgia', serif; letter-spacing: -0.5px;">
                ¡Sorpresa de San Valentín!
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 32px 40px 32px; text-align: center;">
              <p style="color: #be123c; font-size: 18px; margin: 0 0 16px 0; font-weight: 500;">
                Hola, ${receiverName} ✨
              </p>
              
              <p style="color: #4b5563; font-size: 16px; margin: 0 0 32px 0; line-height: 1.6;">
                <strong style="color: #e11d48;">${senderName}</strong> te ha enviado una carta secreta.<br>
                Hay palabras escritas con el corazón esperando ser leídas por vos.
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #e11d48; border-radius: 50px; transition: all 0.3s ease;">
                    <a href="${letterUrl}" target="_blank" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; font-family: sans-serif; border-radius: 50px; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.25);">
                      Leer mi carta &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0 0;">
                El enlace expira pronto, ¡no lo dejes pasar!
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #fff0f5; padding: 24px 32px; text-align: center; border-top: 1px solid #fce7f3;">
              <p style="color: #9d174d; font-size: 13px; margin: 0;">
                Hecho con 💖 para este 14 de Febrero por
                <a href="https://www.instagram.com/liammdev/" target="_blank" style="color: #be185d; text-decoration: none; font-weight: 700; border-bottom: 1px dashed #be185d;">@LiammDev</a>
              </p>
            </td>
          </tr>
          
        </table>
        
        <p style="margin-top: 24px; color: #fda4af; font-size: 12px;">
           © ${new Date().getFullYear()} Carta Secreta
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`

  const fromAddress =
    process.env.RESEND_FROM || "Carta Secreta <onboarding@resend.dev>"

  console.log(`Sending email from ${fromAddress} to ${to} using Resend...`)

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject: `💌 ${senderName} te escribió una carta sorpresa`,
    html: htmlContent,
  })

  if (error) {
    console.error("Resend error detail:", JSON.stringify(error, null, 2))
    throw new Error(`Failed to send email: ${error.message}`)
  }

  console.log("Resend response data:", JSON.stringify(data, null, 2))
  return data
}