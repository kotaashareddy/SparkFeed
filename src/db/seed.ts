import { db } from "./index"
import { users } from "./schema"
import { randomUUID } from "crypto"

async function seed() {
    console.log("🌱 Seeding database...")
    
    const apiKey = `spark_dev_${randomUUID().replace(/-/g, '').slice(0, 16)}`
    
    await db.insert(users).values({
        id: randomUUID(),
        email: "admin@sparkfeed.app",
        apiKey: apiKey,
        name: "Default Admin Project"
    })

    console.log("✅ Seed complete!")
    console.log("--------------------------------")
    console.log("YOUR API KEY:")
    console.log("\x1b[32m%s\x1b[0m", apiKey)
    console.log("--------------------------------")
    console.log("Use this key in your <SparkFeed apiKey=\"...\" /> component.")
}

seed().catch(console.error)
