import { createFileRoute } from "@tanstack/react-router"
import { useState, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ArticleGrid } from "@/components/ArticleGrid"
import { AddFeedModal } from "@/components/AddFeedModal"
import { getAllData } from "@/server/rss"
import type { Selection, FolderRow, FeedRow } from "@/components/Sidebar"
import type { ArticleRow } from "@/components/ArticleGrid"

export const Route = createFileRoute("/")({
  loader: async () => {
    return await getAllData()
  },
  component: RSSReader,
})

function RSSReader() {
  const loaderData = Route.useLoaderData()

  const [folders, setFolders] = useState<FolderRow[]>(loaderData.folders)
  const [feeds, setFeeds] = useState<FeedRow[]>(loaderData.feeds)
  const [rawArticles, setRawArticles] = useState(loaderData.articles)

  const [selection, setSelection] = useState<Selection>({ type: "all" })
  const [addFeedOpen, setAddFeedOpen] = useState(false)

  // Reload all data from DB
  const reload = useCallback(async () => {
    const data = await getAllData()
    setFolders(data.folders)
    setFeeds(data.feeds)
    setRawArticles(data.articles)
  }, [])

  // Build feedId -> feedName map
  const feedNameMap = Object.fromEntries(feeds.map((f) => [f.id, f.name]))

  // Enrich articles with domain + feedName
  const allArticles: ArticleRow[] = rawArticles.map((a) => ({
    ...a,
    feedName: a.feedId ? feedNameMap[a.feedId] : undefined,
    domain: (() => {
      try {
        return new URL(a.link).hostname.replace("www.", "")
      } catch {
        return a.link
      }
    })(),
  }))

  // Compute today timestamp
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  // Filter articles based on sidebar selection
  const filteredArticles = (() => {
    switch (selection.type) {
      case "all":
        return allArticles
      case "today":
        return allArticles.filter(
          (a) => a.publishedAt && new Date(a.publishedAt) >= todayStart
        )
      case "bookmarks":
        return allArticles.filter((a) => a.isBookmarked)
      case "readLater":
        return allArticles.filter((a) => a.isReadLater)
      case "favorites":
        return allArticles.filter((a) => a.isFavorite)
      case "folder": {
        const folderFeeds = feeds.filter((f) => f.folderId === selection.folderId)
        const ids = new Set(folderFeeds.map((f) => f.id))
        return allArticles.filter((a) => a.feedId && ids.has(a.feedId))
      }
      case "feed":
        return allArticles.filter((a) => a.feedId === selection.feedId)
      default:
        return allArticles
    }
  })()

  // Counts per feed (for sidebar badges)
  const articleCounts: Record<string, number> = {}
  for (const a of allArticles) {
    if (a.feedId) {
      articleCounts[a.feedId] = (articleCounts[a.feedId] ?? 0) + 1
    }
  }

  const totalCount = allArticles.length
  const todayCount = allArticles.filter(
    (a) => a.publishedAt && new Date(a.publishedAt) >= todayStart
  ).length
  const bookmarksCount = allArticles.filter((a) => a.isBookmarked).length
  const readLaterCount = allArticles.filter((a) => a.isReadLater).length
  const favoritesCount = allArticles.filter((a) => a.isFavorite).length

  function getSelectionTitle(s: Selection): string {
    switch (s.type) {
      case "all": return "All Articles"
      case "today": return "Today"
      case "bookmarks": return "Bookmarks"
      case "readLater": return "Read Later"
      case "favorites": return "Favorites"
      case "folder": return folders.find(f => f.id === s.folderId)?.name || "Folder"
      case "feed": return feeds.find(f => f.id === s.feedId)?.name || "Feed"
      default: return "RSS Reader"
    }
  }

  const handleFolderCreated = async () => {
    await reload()
  }

  const handleFeedAdded = async () => {
    await reload()
  }

  return (
    <SidebarProvider>
      <AppSidebar
        folders={folders}
        feeds={feeds}
        articleCounts={articleCounts}
        totalCount={totalCount}
        todayCount={todayCount}
        bookmarksCount={bookmarksCount}
        readLaterCount={readLaterCount}
        favoritesCount={favoritesCount}
        selection={selection}
        onSelectionChange={setSelection}
        onFolderCreated={reload}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {getSelectionTitle(selection)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden">
          <ArticleGrid
            articles={filteredArticles}
            selection={selection}
            onAddFeedClick={() => setAddFeedOpen(true)}
            onRefreshed={reload}
            sidebarOpen={true} // Now managed by SidebarProvider
            setSidebarOpen={() => { }} // Now managed by SidebarProvider
          />
        </div>
      </SidebarInset>

      <AddFeedModal
        open={addFeedOpen}
        onOpenChange={setAddFeedOpen}
        folders={folders}
        onFeedAdded={handleFeedAdded}
      />
    </SidebarProvider>
  )
}
