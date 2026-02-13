import "dotenv/config"
import { neon } from "@neondatabase/serverless"

async function main() {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
        console.error("DATABASE_URL not found in process.env")
        process.exit(1)
    }

    console.log("Connecting to database...")
    const sql = neon(databaseUrl)

    try {
        console.log("Adding 'email_provider' column to 'letters' table if not exists...")
        await sql`
      ALTER TABLE letters 
      ADD COLUMN IF NOT EXISTS email_provider TEXT
    `
        console.log("Success: 'email_provider' column added or already exists.")
    } catch (error) {
        console.error("Error updating database:", error)
        process.exit(1)
    }
}

main()
