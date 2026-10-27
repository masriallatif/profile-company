"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const jurusan = [
  { title: "Teknik Komputer dan Jaringan", href: "/jurusan/tkj", description: "Jaringan, server, dan infrastruktur IT." },
  { title: "Rekayasa Perangkat Lunak", href: "/jurusan/rpl", description: "Pemrograman web, mobile, dan aplikasi." },
  { title: "Akuntansi", href: "/jurusan/akuntansi", description: "Pencatatan keuangan dan perpajakan." },
  { title: "Multimedia", href: "/jurusan/multimedia", description: "Desain grafis, video, dan animasi." },
]

export function MenuLandingPage() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1 text-blue-800">
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/" />}
            className={navigationMenuTriggerStyle()}
          >
            Beranda
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Profil</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-72">
              <ListItem href="/profil/sejarah" title="Sejarah">
                Perjalanan SMK MVP ARS Internasional.
              </ListItem>
              <ListItem href="/profil/visi-misi" title="Visi & Misi">
                Arah dan tujuan sekolah.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Jurusan</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] gap-2 md:grid-cols-2">
              {jurusan.map((j) => (
                <ListItem key={j.title} title={j.title} href={j.href}>
                  {j.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/berita" />}
            className={navigationMenuTriggerStyle()}
          >
            Berita
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/ppdb" />}
            className="inline-flex h-9 items-center rounded-full bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            PPDB
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/login" />}
            className={navigationMenuTriggerStyle()}
          >
            Login
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink render={<Link href={href} />}>
        <div className="flex flex-col gap-1 text-sm">
          <div className="leading-none font-medium text-blue-800">{title}</div>
          <div className="line-clamp-2 text-muted-foreground">{children}</div>
        </div>
      </NavigationMenuLink>
    </li>
  )
}