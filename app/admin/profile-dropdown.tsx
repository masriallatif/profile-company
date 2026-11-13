"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, BadgeCheck, CreditCard, LogOut, Sparkles } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type ProfileDropdownProps = {
  nama: string
  email: string
}

const FOTO = "https://github.com/shadcn.png"

export default function ProfileDropdown({ nama, email }: ProfileDropdownProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState("")

  const inisial = nama
    .split(" ")
    .filter(Boolean)
    .map((kata) => kata[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const itemClass =
    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"

  async function handleLogout() {
    setError("")
    setLoggingOut(true)
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? "Logout gagal. Coba lagi.")
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setError("Tidak bisa terhubung ke server.")
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        aria-label="Menu profil"
      >
        <Avatar>
          <AvatarImage src={FOTO} alt={nama} />
          <AvatarFallback>{inisial || "U"}</AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <>
          {/* klik di luar untuk menutup */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-lg border bg-background p-1 shadow-lg">
            <div className="flex items-center gap-2 px-2 py-2">
              <Avatar className="size-8">
                <AvatarImage src={FOTO} alt={nama} />
                <AvatarFallback>{inisial || "U"}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{nama}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {email}
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

            {error && (
              <p className="px-2 py-1 text-xs text-red-600">{error}</p>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className={`${itemClass} disabled:opacity-60`}
            >
              <LogOut className="size-4" />
              {loggingOut ? "Keluar..." : "Log out"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}