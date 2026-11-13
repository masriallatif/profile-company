import { NextResponse } from "next/server"

import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/user-security"

const UNAUTHORIZED = { error: "Silakan login untuk melanjutkan." }

export async function GET(request: Request) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || 10))

  const [totalUsers, rows] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: { id: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, fullname: true, email: true, role: true,
        token: true, createdAt: true, updatedAt: true,
      },
    }),
  ])

  const users = rows.map(({ token, ...user }) => ({ ...user, hasToken: Boolean(token) }))

  return NextResponse.json({
    users,
    pagination: { page, pageSize, totalUsers, totalPages: Math.max(1, Math.ceil(totalUsers / pageSize)) },
  })
}

export async function POST(request: Request) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const fullname = String(body?.fullname ?? "").trim()
  const email = String(body?.email ?? "").trim().toLowerCase()
  const password = String(body?.password ?? "")
  const role = body?.role

  if (!fullname || !email) {
    return NextResponse.json({ error: "Nama dan email wajib diisi." }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password minimal 8 karakter." }, { status: 400 })
  }
  if (role !== "admin" && role !== "staff") {
    return NextResponse.json({ error: "Role harus admin atau staff." }, { status: 400 })
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 })
  }

  const user = await prisma.user.create({
    data: { fullname, email, role, password: hashPassword(password) },
    select: { id: true, fullname: true, email: true, role: true, createdAt: true, updatedAt: true },
  })

  return NextResponse.json({ user }, { status: 201 })
}