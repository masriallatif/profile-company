import { NextResponse } from "next/server"

import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const UNAUTHORIZED = { error: "Silakan login untuk melanjutkan." }

const include = {
  category: { select: { id: true, name: true } },
  author: { select: { id: true, fullname: true } },
}

export async function GET() {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }

  const artikel = await prisma.artikel.findMany({
    orderBy: { id: "desc" },
    include,
  })
  return NextResponse.json({ artikel })
}

export async function POST(request: Request) {
  const me = await getAuthenticatedUser()
  if (!me) return NextResponse.json(UNAUTHORIZED, { status: 401 })

  const body = await request.json().catch(() => null)
  const title = String(body?.title ?? "").trim()
  const content = String(body?.content ?? "").trim()
  const status = body?.status
  const categoryId = body?.categoryId ? Number(body.categoryId) : null

  if (!title || !content) {
    return NextResponse.json({ error: "Judul dan isi wajib diisi." }, { status: 400 })
  }
  if (status !== "draft" && status !== "terbit") {
    return NextResponse.json({ error: "Status harus draft atau terbit." }, { status: 400 })
  }

  if (categoryId !== null) {
    const ada = Number.isInteger(categoryId)
      ? await prisma.category.findUnique({ where: { id: categoryId } })
      : null
    if (!ada) {
      return NextResponse.json({ error: "Kategori tidak ditemukan." }, { status: 400 })
    }
  }

  const artikel = await prisma.artikel.create({
    data: { title, content, status, categoryId, authorId: me.id },
    include,
  })
  return NextResponse.json({ artikel }, { status: 201 })
}