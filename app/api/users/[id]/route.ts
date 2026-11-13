import { NextResponse } from "next/server"

import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/user-security"

type Context = { params: Promise<{ id: string }> }

const UNAUTHORIZED = { error: "Silakan login untuk melanjutkan." }
const NOT_FOUND = { error: "User tidak ditemukan." }

const publicFields = {
  id: true, fullname: true, email: true, role: true, createdAt: true, updatedAt: true,
} as const

async function readId(context: Context) {
  const { id } = await context.params
  const num = Number(id)
  return Number.isInteger(num) ? num : null
}

export async function GET(_request: Request, context: Context) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }
  const id = await readId(context)
  if (id === null) return NextResponse.json(NOT_FOUND, { status: 404 })

  const user = await prisma.user.findUnique({ where: { id }, select: publicFields })
  if (!user) return NextResponse.json(NOT_FOUND, { status: 404 })

  return NextResponse.json({ user })
}

export async function PATCH(request: Request, context: Context) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }
  const id = await readId(context)
  if (id === null) return NextResponse.json(NOT_FOUND, { status: 404 })

  const body = await request.json().catch(() => null)
  const fullname = String(body?.fullname ?? "").trim()
  const email = String(body?.email ?? "").trim().toLowerCase()
  const password = String(body?.password ?? "")
  const role = body?.role

  if (!fullname || !email) {
    return NextResponse.json({ error: "Nama dan email wajib diisi." }, { status: 400 })
  }
  if (role !== "admin" && role !== "staff") {
    return NextResponse.json({ error: "Role harus admin atau staff." }, { status: 400 })
  }
  if (password && password.length < 8) {
    return NextResponse.json({ error: "Password minimal 8 karakter." }, { status: 400 })
  }

  const current = await prisma.user.findUnique({ where: { id } })
  if (!current) return NextResponse.json(NOT_FOUND, { status: 404 })

  const sameEmail = await prisma.user.findUnique({ where: { email } })
  if (sameEmail && sameEmail.id !== id) {
    return NextResponse.json({ error: "Email sudah dipakai user lain." }, { status: 409 })
  }

  const user = await prisma.user.update({
    where: { id },
    data: { fullname, email, role, ...(password ? { password: hashPassword(password) } : {}) },
    select: publicFields,
  })

  return NextResponse.json({ user })
}

export async function DELETE(_request: Request, context: Context) {
  const me = await getAuthenticatedUser()
  if (!me) return NextResponse.json(UNAUTHORIZED, { status: 401 })

  const id = await readId(context)
  if (id === null) return NextResponse.json(NOT_FOUND, { status: 404 })

  if (me.id === id) {
    return NextResponse.json({ error: "Kamu tidak bisa menghapus akunmu sendiri." }, { status: 400 })
  }

  const exists = await prisma.user.findUnique({ where: { id } })
  if (!exists) return NextResponse.json(NOT_FOUND, { status: 404 })

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}