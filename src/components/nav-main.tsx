"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    isActive?: boolean
    onClick?: () => void
    badge?: React.ReactNode
  }[]
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            isActive={item.isActive}
            onClick={item.onClick}
            tooltip={item.title}
          >
            {item.icon}
            <span>{item.title}</span>
            {item.badge && (
              <div className="ml-auto text-[10px] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
                {item.badge}
              </div>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
