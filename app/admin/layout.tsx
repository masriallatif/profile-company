import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getAuthenticatedUser } from "@/lib/auth"

import ProfileDropdown from "./profile-dropdown"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthenticatedUser()

  if (!user) {
    redirect("/")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <header className="flex h-14 items-center justify-between border-b-2 border-orange-500 px-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <span className="font-semibold text-blue-800">
              Panel Admin SMK MVP ARS
            </span>
          </div>
          <ProfileDropdown nama={user.fullname} email={user.email} />
        </header>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}