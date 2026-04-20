import { db } from "@/db/index"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getRequest } from "@tanstack/react-start/server"

/**
 * Extracts and validates the API key from the request headers.
 * Returns the userId associated with the key.
 * Throws an error if the key is missing or invalid.
 */
export async function getAuthUser() {
    const request = getRequest()
    const apiKey = request?.headers.get("x-api-key")


    if (!apiKey) {
        throw new Error("Missing API Key. Please provide x-api-key in headers.")
    }

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.apiKey, apiKey))
        .limit(1)

    if (!user) {
        throw new Error("Invalid API Key.")
    }

    return user
}
