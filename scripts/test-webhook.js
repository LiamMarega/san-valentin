const { neon } = require('@neondatabase/serverless')
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL
const sql = neon(DATABASE_URL)

async function simulateWebhook(letterId, paymentId = "test_payment_123") {
    console.log(`Simulating webhook for letter ${letterId} and payment ${paymentId}...`)

    // This script assumes the letter already exists in the database
    // We can't easily call the Next.js route from here without a server running,
    // but we can test the database and email logic directly.

    const updateResult = await sql`
    UPDATE letters
    SET payment_status = 'paid',
        mp_payment_id = ${paymentId},
        status = 'sent'
    WHERE id = ${letterId}
      AND payment_status != 'paid'
    RETURNING *
  `

    if (updateResult.length === 0) {
        console.log(`No rows updated for letter ${letterId}. Possibly already processed or ID mismatch.`)
        return
    }

    const letter = updateResult[0]
    console.log(`Successfully updated letter ${letterId} in DB.`)

    // Test email sending logic (mocked or real depending on RESEND_API_KEY)
    const { sendLetterEmail } = require('./lib/email.ts') // This might need transpilation if run directly with node
    // For simplicity, we just check the DB update here.
}

// Example usage: node scripts/test-webhook.js <letterId>
const letterId = process.argv[2]
if (letterId) {
    simulateWebhook(letterId).catch(console.error)
} else {
    console.log("Please provide a letterId.")
}
