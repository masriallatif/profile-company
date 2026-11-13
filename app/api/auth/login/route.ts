import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { createJwt, verifyPassword } from "@/lib/user-security"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = String(body?.email ?? "").trim().toLowerCase()
  const password = String(body?.password ?? "")

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !verifyPassword(password, user.password)) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 })
  }

  const token = createJwt({ sub: user.id })
  await prisma.user.update({ where: { id: user.id }, data: { token } })

  const response = NextResponse.json({
    user: { id: user.id, fullname: user.fullname, email: user.email, role: user.role },
  })

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  return response
}