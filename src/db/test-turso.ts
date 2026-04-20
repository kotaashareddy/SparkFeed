import { createClient } from "@libsql/client"

async function test() {
    const url = "libsql://sparkfeeddeployed-asha.aws-ap-south-1.turso.io"
    const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY2NzY5MTUsImlkIjoiMDE5ZGE5OTktOWQwMS03M2U4LTgzZmItNDkxZjc3ODRmNDE3IiwicmlkIjoiNGEzYzk4NWItYzIxMC00NTViLWJiZTgtYTJhNjUzNWFiYTQ3In0.uQfnkMe5h5AsdKfN_JvqihViqP7RqrymZhswpUep9shBsg8SruOI-SH8sY3wiP5cEb1bTY3oUkkq93VPzauyBw"
    
    console.log("🔍 Testing connection to Turso...")
    const client = createClient({ url, authToken })
    
    try {
        const result = await client.execute("SELECT 1")
        console.log("✅ Connection SUCCESSFUL!")
        console.log("Result:", result)
    } catch (e: any) {
        console.error("❌ Connection FAILED!")
        console.error("Error Message:", e.message)
        console.error("Error Code:", e.code)
    } finally {
        process.exit(0)
    }
}

test()
