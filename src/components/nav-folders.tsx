"use client"

import { useState } from "react"
import { ChevronRight, PlusIcon, Edit2, Trash2 } from "lucide-react"

import { AddFolderModal } from "@/components/AddFolderModal"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { renameFolder, deleteFolder, renameFeed, deleteFeed } from "@/server/rss"
import type { FolderRow, FeedRow, Selection } from "@/components/Sidebar"



interface NavFoldersProps {
  folders: FolderRow[]
  feeds: FeedRow[]
  selection: Selection
  articleCounts: Record<string, number>
  onSelectionChange: (s: Selection) => void
  onFolderCreated: () => void
}

export function NavFolders({
  folders,
  feeds,
  selection,
  articleCounts,
  onSelectionChange,
  onFolderCreated,
}: NavFoldersProps) {
  const [addFolderOpen, setAddFolderOpen] = useState(false)
  const [deleteData, setDeleteData] = useState<{ type: "folder" | "feed", id: string, name: string } | null>(null)

  const handleRename = async (type: "folder" | "feed", id: string, oldName: string) => {
    const newName = window.prompt(`Rename ${oldName} to:`, oldName)
    if (!newName || newName === oldName) return
    if (type === "folder") {
      await renameFolder({ data: { id, name: newName } })
    } else {
      await renameFeed({ data: { id, name: newName } })
    }
    onFolderCreated() // Refresh SWR
  }

  const handleDeleteConfirm = async () => {
    if (!deleteData) return
    if (deleteData.type === "folder") {
      await deleteFolder({ data: { id: deleteData.id } })
    } else {
      await deleteFeed({ data: { id: deleteData.id } })
    }
    setDeleteData(null)
    onFolderCreated() // Refresh SWR
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="flex items-center justify-between pr-1">
          <span>Folders</span>
          <button
            onClick={() => setAddFolderOpen(true)}
            className="flex size-4 items-center justify-center rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            aria-label="Add folder"
          >
            <PlusIcon className="size-3.5" />
          </button>
        </SidebarGroupLabel>

        <SidebarMenu>


          {/* Real folders from DB — each collapsible, showing its feeds */}
          {folders.map((folder) => {
            const folderFeeds = feeds.filter((f) => f.folderId === folder.id)
            const isFolderActive =
              selection.type === "folder" && selection.folderId === folder.id
            const folderCount = folderFeeds.reduce((acc, f) => acc + (articleCounts[f.id] || 0), 0)

            return (
              <Collapsible key={folder.id} defaultOpen={isFolderActive}>
                <ContextMenu>
                  <ContextMenuTrigger >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={isFolderActive}
                        tooltip={folder.name}
                        onClick={() =>
                          onSelectionChange({ type: "folder", folderId: folder.id })
                        }
                      >
                        <span>{folder.name}</span>
                        {folderCount > 0 && <span className="ml-auto text-xs text-muted-foreground mr-2">{folderCount}</span>}
                      </SidebarMenuButton>

                      {folderFeeds.length > 0 && (
                        <SidebarMenuAction
                          render={<CollapsibleTrigger />}
                          className="data-[panel-open]:rotate-90 transition-transform"
                          showOnHover
                        >
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      )}

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {folderFeeds.map((feed) => {
                            const feedCount = articleCounts[feed.id] || 0
                            return (
                              <ContextMenu key={feed.id}>
                                <ContextMenuTrigger >
                                  <SidebarMenuSubItem>
                                    <SidebarMenuSubButton
                                      isActive={
                                        selection.type === "feed" &&
                                        selection.feedId === feed.id
                                      }
                                      onClick={() =>
                                        onSelectionChange({
                                          type: "feed",
                                          feedId: feed.id,
                                        })
                                      }
                                    >
                                      <span>{feed.name}</span>
                                      {feedCount > 0 && <span className="ml-auto text-xs text-muted-foreground mr-1">{feedCount}</span>}
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                  <ContextMenuItem onClick={() => handleRename("feed", feed.id, feed.name)}>
                                    <Edit2 className="mr-2 size-4" /> Rename
                                  </ContextMenuItem>
                                  <ContextMenuSeparator />
                                  <ContextMenuItem onClick={() => setDeleteData({ type: "feed", id: feed.id, name: feed.name })} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 size-4" /> Delete
                                  </ContextMenuItem>
                                </ContextMenuContent>
                              </ContextMenu>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>

                    </SidebarMenuItem>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => handleRename("folder", folder.id, folder.name)}>
                      <Edit2 className="mr-2 size-4" /> Rename
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => setDeleteData({ type: "folder", id: folder.id, name: folder.name })} className="text-red-600 focus:text-red-600">
                      <Trash2 className="mr-2 size-4" /> Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>

              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarGroup>

      {/* Add Folder Dialog */}
      <AddFolderModal
        open={addFolderOpen}
        onOpenChange={setAddFolderOpen}
        onFolderCreated={() => onFolderCreated()}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteData} onOpenChange={(open) => !open && setDeleteData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {deleteData?.type} <strong>{deleteData?.name}</strong>.
              {deleteData?.type === "folder" && " All feeds and articles inside this folder will also be deleted."}
              {deleteData?.type === "feed" && " All articles inside this feed will also be deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirm()
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
