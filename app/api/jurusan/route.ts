import { NextResponse } from "next/server"

import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const UNAUTHORIZED = { error: "Silakan login untuk melanjutkan." }

export async function GET() {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }

  const jurusan = await prisma.jurusan.findMany({ orderBy: { id: "asc" } })
  return NextResponse.json({ jurusan })
}

export async function POST(request: Request) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const name = String(body?.name ?? "").trim()
  const description = String(body?.description ?? "").trim()

  if (!name) {
    return NextResponse.json({ error: "Nama jurusan wajib diisi." }, { status: 400 })
  }

  const jurusan = await prisma.jurusan.create({ data: { name, description } })
  return NextResponse.json({ jurusan }, { status: 201 })
}