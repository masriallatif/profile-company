import { cookies } from "next/headers"

import { prisma } from "@/lib/prisma"
import { verifyJwt } from "@/lib/user-security"

export async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  if (!token) return null

  const payload = verifyJwt(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.sub) },
    select: { id: true, fullname: true, email: true, role: true, token: true },
  })

  // token di cookie harus sama dengan token di database
  if (!user || user.token !== token) return null

  return { id: user.id, fullname: user.fullname, email: user.email, role: user.role }
}