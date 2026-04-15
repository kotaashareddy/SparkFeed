import { defineEventHandler, setResponseHeader, getRequestURL } from "h3"
import { db } from "../../src/db/index"
import { folders as foldersTable, feeds as feedsTable, articles as articlesTable } from "../../src/db/schema"
import { eq, desc, inArray } from "drizzle-orm"

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, "-")
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return ""
  return unsafe.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&": return "&amp;"
      case "<": return "&lt;"
      case ">": return "&gt;"
      case "\"": return "&quot;"
      case "'": return "&apos;"
      default: return m
    }
  })
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname

  if (!pathname.endsWith("/feed")) return

  try {
    const slugParts = pathname.split("/").filter(Boolean).slice(0, -1)
    if (slugParts.length === 0) return

    // Fetch all folders and feeds using Drizzle
    const folders = await db.select().from(foldersTable)
    const allFeeds = await db.select().from(feedsTable)

    const folderSlug = slugParts[0]
    const folder = folders.find((f) => slugify(f.name) === folderSlug)

    let targetFeedIds: string[] = []
    let channelTitle = ""

    if (folder) {
      channelTitle = folder.name
      if (slugParts.length === 1) {
        targetFeedIds = allFeeds.filter((f) => f.folderId === folder.id).map((f) => f.id)
      } else if (slugParts.length === 2) {
        const feedSlug = slugParts[1]
        const feed = allFeeds.find((f) => f.folderId === folder.id && slugify(f.name) === feedSlug)
        if (feed) {
          targetFeedIds = [feed.id]
          channelTitle = feed.name
        }
      }
    } else if (slugParts.length === 2 && slugParts[0] === "feed") {
      const feedSlug = slugParts[1]
      const feed = allFeeds.find((f) => !f.folderId && slugify(f.name) === feedSlug)
      if (feed) {
        targetFeedIds = [feed.id]
        channelTitle = feed.name
      }
    }

    if (targetFeedIds.length === 0) return

    // Fetch articles using Drizzle
    const articles = await db
      .select()
      .from(articlesTable)
      .where(inArray(articlesTable.feedId, targetFeedIds))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(50)

    const itemsXml = articles.map((article) => {
      const enclosure = article.image
        ? `<enclosure url="${escapeXml(article.image)}" type="image/jpeg" length="0"/>`
        : ""

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(article.link)}</link>
      <description>${escapeXml(article.description || "")}</description>
      <pubDate>${article.publishedAt ? new Date(article.publishedAt).toUTCString() : ""}</pubDate>
      ${enclosure}
    </item>`
    }).join("\n")

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${url.origin}</link>
    <description>Latest articles from ${escapeXml(channelTitle)}</description>
    <generator>SparkFeed</generator>
${itemsXml}
  </channel>
</rss>`

    setResponseHeader(event, "Content-Type", "application/rss+xml; charset=utf-8")
    return xml
  } catch (err) {
    console.error("RSS Middleware Error:", err)
  }
})

