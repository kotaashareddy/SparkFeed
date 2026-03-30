import { AppSidebar } from "@/components/sidebar10/app-sidebar"
import { NavActions } from "@/components/nav-actions"
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
import type { FolderRow, FeedRow, Selection } from "@/components/Sidebar"

interface Sidebar10PageProps {
  folders: FolderRow[]
  feeds: FeedRow[]
  articleCounts: Record<string, number>
  totalCount: number
  todayCount: number
  bookmarksCount: number
  readLaterCount: number
  favoritesCount: number
  selection: Selection
  onSelectionChange: (s: Selection) => void
}

export default function Sidebar10Page({
  folders,
  feeds,
  articleCounts,
  totalCount,
  todayCount,
  bookmarksCount,
  readLaterCount,
  favoritesCount,
  selection,
  onSelectionChange,
}: Sidebar10PageProps) {
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
        onSelectionChange={onSelectionChange}
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
                    RSS Reader
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-4 py-10">
          <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
          <div className="mx-auto h-full w-full max-w-3xl rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
