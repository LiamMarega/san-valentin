const ARGENTINA_TIMEZONES = [
  "America/Argentina/Buenos_Aires",
  "America/Argentina/Cordoba",
  "America/Argentina/Salta",
  "America/Argentina/Jujuy",
  "America/Argentina/Tucuman",
  "America/Argentina/Catamarca",
  "America/Argentina/La_Rioja",
  "America/Argentina/San_Juan",
  "America/Argentina/Mendoza",
  "America/Argentina/San_Luis",
  "America/Argentina/Rio_Gallegos",
  "America/Argentina/Ushuaia",
  "America/Buenos_Aires",
]

export function isArgentinaTimezone(timezone: string): boolean {
  return (
    ARGENTINA_TIMEZONES.includes(timezone) ||
    timezone.startsWith("America/Argentina/")
  )
}

export type PaymentProvider = "mercadopago" | "paypal"

export function getPaymentProvider(timezone: string): PaymentProvider {
  return isArgentinaTimezone(timezone) ? "mercadopago" : "paypal"
}
