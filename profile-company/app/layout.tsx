import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SMK MVP ARS Internasional",
  description: "Website resmi SMK MVP ARS Internasional",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}