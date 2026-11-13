import { NextResponse } from "next/server"

import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Context = { params: Promise<{ id: string }> }

const UNAUTHORIZED = { error: "Silakan login untuk melanjutkan." }
const NOT_FOUND = { error: "Jurusan tidak ditemukan." }

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

  const jurusan = await prisma.jurusan.findUnique({ where: { id } })
  if (!jurusan) return NextResponse.json(NOT_FOUND, { status: 404 })

  return NextResponse.json({ jurusan })
}

export async function PATCH(request: Request, context: Context) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }
  const id = await readId(context)
  if (id === null) return NextResponse.json(NOT_FOUND, { status: 404 })

  const body = await request.json().catch(() => null)
  const name = String(body?.name ?? "").trim()
  const description = String(body?.description ?? "").trim()

  if (!name) {
    return NextResponse.json({ error: "Nama jurusan wajib diisi." }, { status: 400 })
  }

  const exists = await prisma.jurusan.findUnique({ where: { id } })
  if (!exists) return NextResponse.json(NOT_FOUND, { status: 404 })

  const jurusan = await prisma.jurusan.update({
    where: { id },
    data: { name, description },
  })
  return NextResponse.json({ jurusan })
}

export async function DELETE(_request: Request, context: Context) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }
  const id = await readId(context)
  if (id === null) return NextResponse.json(NOT_FOUND, { status: 404 })

  const exists = await prisma.jurusan.findUnique({ where: { id } })
  if (!exists) return NextResponse.json(NOT_FOUND, { status: 404 })

  await prisma.jurusan.delete({ where: { id } })
  return NextResponse.json({ success: true })
}