/**
 * Unified API Client for the SparkFeed SaaS.
 * This client sends authenticated requests to your Vercel backend.
 */

export class SparkFeedClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, baseUrl: string = "https://spark-feed-z3m9.vercel.app") {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    private async request(path: string, options: RequestInit = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Unknown error" }));
            throw new Error(error.message || "Request failed");
        }

        return response.json();
    }

    // --- Feed & Folder Actions ---

    async getAllData() {
        return this.request("/api/functions/getAllData");
    }

    async createFolder(name: string) {
        return this.request("/api/functions/createFolder", {
            method: "POST",
            body: JSON.stringify({ name }),
        });
    }

    async createFeed(data: any) {
        return this.request("/api/functions/createFeed", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async refreshAllFeeds() {
        return this.request("/api/functions/refreshAllFeeds", { method: "POST" });
    }

    async refreshFolder(folderId: string) {
        return this.request("/api/functions/refreshFolder", {
            method: "POST",
            body: JSON.stringify({ folderId }),
        });
    }

    // --- Article Actions ---

    async toggleBookmark(id: string, state: boolean) {
        return this.request("/api/functions/toggleBookmark", {
            method: "POST",
            body: JSON.stringify({ id, state }),
        });
    }

    async toggleReadLater(id: string, state: boolean) {
        return this.request("/api/functions/toggleReadLater", {
            method: "POST",
            body: JSON.stringify({ id, state }),
        });
    }

    async toggleFavorite(id: string, state: boolean) {
        return this.request("/api/functions/toggleFavorite", {
            method: "POST",
            body: JSON.stringify({ id, state }),
        });
    }

    async deleteFeed(id: string) {
        return this.request("/api/functions/deleteFeed", {
            method: "POST",
            body: JSON.stringify({ id }),
        });
    }

    async deleteFolder(id: string) {
        return this.request("/api/functions/deleteFolder", {
            method: "POST",
            body: JSON.stringify({ id }),
        });
    }
}
