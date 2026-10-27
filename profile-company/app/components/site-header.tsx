"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MenuLandingPage } from "./landing-page-hero/landing-page-hero"

export function SiteHeader() {
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) return null

  return (
    <header className="sticky top-0 z-40 border-b-4 border-orange-500 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Logo SMK MVP ARS Internasional"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />
          <div className="leading-tight">
            <p className="text-lg font-extrabold text-blue-800">SMK MVP ARS</p>
            <p className="text-xs font-semibold tracking-widest text-orange-500">
              INTERNASIONAL
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <MenuLandingPage />
          <Link href="/login">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}