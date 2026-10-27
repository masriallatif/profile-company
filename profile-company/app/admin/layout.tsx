"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, BadgeCheck, CreditCard, LogOut, Sparkles } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const user = {
  nama: "Ganteng",
  email: "ganteng@sekolah.sch.id",
  foto: "https://github.com/shadcn.png",
}

function ProfileDropdown() {
  const [open, setOpen] = useState(false)

  const itemClass =
    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        aria-label="Menu profil"
      >
        <Avatar>
          <AvatarImage src={user.foto} alt={user.nama} />
          <AvatarFallback>GA</AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <>
          {/* klik di luar untuk menutup */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-lg border bg-background p-1 shadow-lg">
            <div className="flex items-center gap-2 px-2 py-2">
              <Avatar className="size-8">
                <AvatarImage src={user.foto} alt={user.nama} />
                <AvatarFallback>GA</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.nama}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="my-1 h-px bg-border" />

            <Link href="#" onClick={() => setOpen(false)} className={itemClass}>
              <Sparkles className="size-4" />
              Upgrade to Pro
            </Link>

            <div className="my-1 h-px bg-border" />

            <Link
              href="/admin/profile"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              <BadgeCheck className="size-4" />
              Account
            </Link>
            <Link href="#" onClick={() => setOpen(false)} className={itemClass}>
              <CreditCard className="size-4" />
              Billing
            </Link>
            <Link href="#" onClick={() => setOpen(false)} className={itemClass}>
              <Bell className="size-4" />
              Notifications
            </Link>

            <div className="my-1 h-px bg-border" />

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              <LogOut className="size-4" />
              Log out
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          <ProfileDropdown />
        </header>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
} 