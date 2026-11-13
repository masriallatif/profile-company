import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

// ---------- PASSWORD ----------
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  const expected = Buffer.from(hash, "hex")
  const actual = scryptSync(password, salt, expected.length)
  return timingSafeEqual(expected, actual)
}

// ---------- JWT (HS256) ----------
function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET belum diisi di .env")
  return secret
}

const b64 = (input: Buffer | string) =>
  Buffer.from(input).toString("base64url")

function sign(data: string) {
  return createHmac("sha256", getSecret()).update(data).digest("base64url")
}

export function createJwt(payload: Record<string, unknown>, expiresInSeconds = 60 * 60 * 24) {
  const header = b64(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
  const body = b64(JSON.stringify({ ...payload, exp }))
  return `${header}.${body}.${sign(`${header}.${body}`)}`
}

export function verifyJwt(token: string): { sub: number; exp: number } | null {
  const parts = token.split(".")
  if (parts.length !== 3) return null
  const [header, body, signature] = parts

  const expected = Buffer.from(sign(`${header}.${body}`))
  const received = Buffer.from(signature)
  if (expected.length !== received.length) return null
  if (!timingSafeEqual(expected, received)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString())
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) return null
    return payload
  } catch {
    return null
  }
}