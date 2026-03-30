import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavFolders } from "@/components/nav-folders"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CompassIcon, Sun, Heart, BotIcon, TerminalIcon } from "lucide-react"
import type { FolderRow, FeedRow, Selection } from "@/components/Sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  folders: FolderRow[]
  feeds: FeedRow[]
  articleCounts: Record<string, number>
  totalCount: number
  todayCount: number
  favoritesCount: number
  selection: Selection
  onSelectionChange: (s: Selection) => void
  onFolderCreated: () => void
}

export function AppSidebar({
  folders,
  feeds,
  articleCounts,
  totalCount,
  todayCount,
  favoritesCount,
  selection,
  onSelectionChange,
  onFolderCreated,
  ...props
}: AppSidebarProps) {
  const teams = [
    {
      name: "RSS Reader",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ]

  const navMain = [
    {
      title: "Explore",
      url: "#",
      icon: <CompassIcon />,
      isActive: selection.type === "all",
      onClick: () => onSelectionChange({ type: "all" }),
      badge: totalCount > 0 ? totalCount : undefined,
    },
    {
      title: "Today",
      url: "#",
      icon: <Sun />,
      isActive: selection.type === "today",
      onClick: () => onSelectionChange({ type: "today" }),
      badge: todayCount > 0 ? todayCount : undefined,
    },
    {
      title: "Favorites",
      url: "#",
      icon: <Heart />,
      isActive: selection.type === "favorites",
      onClick: () => onSelectionChange({ type: "favorites" }),
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
    {
      title: "AI",
      url: "#",
      icon: <BotIcon />,
      isActive: selection.type === "ai" as any,
      onClick: () => onSelectionChange({ type: "ai" } as any),
    },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* Folders section: Playground demo + real DB folders with + button */}
        <NavFolders
          folders={folders}
          feeds={feeds}
          articleCounts={articleCounts}
          selection={selection}
          onSelectionChange={onSelectionChange}
          onFolderCreated={onFolderCreated}
        />
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <div className="flex flex-col gap-4 rounded-xl border bg-background p-4 shadow-sm dark:border-zinc-800">
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[13px] font-semibold text-foreground">Get Weekly Digest</h4>
            <p className="text-xs text-muted-foreground leading-snug">
              Subscribe to receive a curated weekly roundup of your favorite RSS feeds.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="Email"
              className="h-8 bg-background text-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-zinc-400"
            />
            <Button className="h-8 w-full bg-zinc-900 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
              Subscribe
            </Button>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
