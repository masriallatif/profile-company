import { NextResponse } from "next/server"

import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Context = { params: Promise<{ id: string }> }

const UNAUTHORIZED = { error: "Silakan login untuk melanjutkan." }
const NOT_FOUND = { error: "Artikel tidak ditemukan." }

const include = {
  category: { select: { id: true, name: true } },
  author: { select: { id: true, fullname: true } },
}

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

  const artikel = await prisma.artikel.findUnique({ where: { id }, include })
  if (!artikel) return NextResponse.json(NOT_FOUND, { status: 404 })

  return NextResponse.json({ artikel })
}

export async function PATCH(request: Request, context: Context) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }
  const id = await readId(context)
  if (id === null) return NextResponse.json(NOT_FOUND, { status: 404 })

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

  const exists = await prisma.artikel.findUnique({ where: { id } })
  if (!exists) return NextResponse.json(NOT_FOUND, { status: 404 })

  if (categoryId !== null) {
    const ada = Number.isInteger(categoryId)
      ? await prisma.category.findUnique({ where: { id: categoryId } })
      : null
    if (!ada) {
      return NextResponse.json({ error: "Kategori tidak ditemukan." }, { status: 400 })
    }
  }

  const artikel = await prisma.artikel.update({
    where: { id },
    data: { title, content, status, categoryId },
    include,
  })
  return NextResponse.json({ artikel })
}

export async function DELETE(_request: Request, context: Context) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }
  const id = await readId(context)
  if (id === null) return NextResponse.json(NOT_FOUND, { status: 404 })

  const exists = await prisma.artikel.findUnique({ where: { id } })
  if (!exists) return NextResponse.json(NOT_FOUND, { status: 404 })

  await prisma.artikel.delete({ where: { id } })
  return NextResponse.json({ success: true })
}