const PAYPAL_BASE_URL =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set")
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`PayPal auth failed: ${res.status} ${errorText}`)
  }

  const data = await res.json()
  return data.access_token
}

export async function createPayPalOrder(params: {
  letterId: string
  senderName: string
  receiverName: string
}): Promise<{ orderId: string }> {
  const accessToken = await getAccessToken()

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.letterId,
          description: `Premium Letter - From ${params.senderName} to ${params.receiverName}`,
          amount: {
            currency_code: "USD",
            value: "1.00",
          },
        },
      ],
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`PayPal create order failed: ${res.status} ${errorText}`)
  }

  const order = await res.json()

  return {
    orderId: order.id,
  }
}

export async function capturePayPalOrder(orderId: string): Promise<{
  status: string
  letterId: string
  captureId: string
}> {
  const accessToken = await getAccessToken()

  const res = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  )

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`PayPal capture failed: ${res.status} ${errorText}`)
  }

  const data = await res.json()
  const purchaseUnit = data.purchase_units?.[0]
  const capture = purchaseUnit?.payments?.captures?.[0]

  return {
    status: data.status,
    letterId: purchaseUnit?.reference_id || "",
    captureId: capture?.id || orderId,
  }
}
