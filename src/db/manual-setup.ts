import { createClient } from "@libsql/client"

async function setup() {
    const url = "libsql://sparkfeeddeployed-asha.aws-ap-south-1.turso.io"
    const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY2NzY5MTUsImlkIjoiMDE5ZGE5OTktOWQwMS03M2U4LTgzZmItNDkxZjc3ODRmNDE3IiwicmlkIjoiNGEzYzk4NWItYzIxMC00NTViLWJiZTgtYTJhNjUzNWFiYTQ3In0.uQfnkMe5h5AsdKfN_JvqihViqP7RqrymZhswpUep9shBsg8SruOI-SH8sY3wiP5cEb1bTY3oUkkq93VPzauyBw"
    
    console.log("🚀 Manually creating tables on Turso...")
    const client = createClient({ url, authToken })
    
    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            api_key TEXT NOT NULL UNIQUE,
            name TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS folders (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            user_id TEXT NOT NULL REFERENCES users(id),
            created_at TEXT DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS feeds (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            user_id TEXT NOT NULL REFERENCES users(id),
            folder_id TEXT REFERENCES folders(id),
            include_keywords TEXT,
            exclude_keywords TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS articles (
            id TEXT PRIMARY KEY,
            feed_id TEXT REFERENCES feeds(id),
            title TEXT NOT NULL,
            description TEXT,
            link TEXT NOT NULL,
            image TEXT,
            published_at TEXT,
            is_used INTEGER DEFAULT 0,
            visit_count INTEGER DEFAULT 0,
            is_bookmarked INTEGER DEFAULT 0,
            is_read_later INTEGER DEFAULT 0,
            is_favorite INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
        )`
    ]
    
    for (const q of queries) {
        console.log(`Executing: ${q.split('(')[0]}...`)
        await client.execute(q)
    }
    
    console.log("✅ Tables created successfully!")
    process.exit(0)
}

setup().catch(console.error)
