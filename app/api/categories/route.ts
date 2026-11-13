import { NextResponse } from "next/server"

import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const UNAUTHORIZED = { error: "Silakan login untuk melanjutkan." }

export async function GET() {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }

  const categories = await prisma.category.findMany({ orderBy: { id: "asc" } })
  return NextResponse.json({ categories })
}

export async function POST(request: Request) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const name = String(body?.name ?? "").trim()

  if (!name) {
    return NextResponse.json({ error: "Nama kategori wajib diisi." }, { status: 400 })
  }

  const category = await prisma.category.create({ data: { name } })
  return NextResponse.json({ category }, { status: 201 })
}