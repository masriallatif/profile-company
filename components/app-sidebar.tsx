"use client"

import Link from "next/link"
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  School,
  Shapes,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Kategori", url: "/admin/category", icon: Shapes },
  { title: "Jurusan", url: "/admin/jurusan", icon: GraduationCap },
  { title: "Artikel", url: "/admin/artikel", icon: BookOpen },
  { title: "Profil", url: "/admin/profile", icon: School },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <p className="px-2 text-lg font-extrabold text-blue-800">
          SMK MVP ARS
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <p className="px-2 text-xs text-slate-500">Admin Panel</p>
      </SidebarFooter>
    </Sidebar>
  )
}