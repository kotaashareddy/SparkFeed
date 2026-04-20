import { defineEventHandler, setResponseHeaders } from "h3"

export default defineEventHandler((event) => {
    // Enable CORS for API requests
    setResponseHeaders(event, {
        "Access-Control-Allow-Origin": "*", // Or your specific domain
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key, Authorization",
    })

    // Handle OPTIONS preflight
    if (event.method === "OPTIONS") {
        event.node.res.statusCode = 204
        event.node.res.statusMessage = "No Content"
        return ""
    }
})
