import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (token) {
    await prisma.user.updateMany({ where: { token }, data: { token: null } })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.delete("auth_token")
  return response
}