"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type UserFormProps = {
  mode: "add" | "edit"
  id?: string
}

export default function UserForm({ mode, id }: UserFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"

  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "staff">("staff")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Mode edit: ambil data user lama untuk mengisi form
  useEffect(() => {
    if (!isEdit) return
    let batal = false

    async function loadUser() {
      try {
        const res = await fetch(`/api/users/${id}`)

        if (res.status === 401) {
          window.location.href = "/"
          return
        }

        const data = await res.json().catch(() => null)

        if (!res.ok) {
          if (!batal) setError(data?.error ?? "Gagal memuat data user.")
          return
        }

        if (!batal) {
          setFullname(data.user.fullname)
          setEmail(data.user.email)
          setRole(data.user.role === "admin" ? "admin" : "staff")
        }
      } catch {
        if (!batal) setError("Tidak bisa terhubung ke server.")
      } finally {
        if (!batal) setLoading(false)
      }
    }

    loadUser()
    return () => {
      batal = true
    }
  }, [isEdit, id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (!fullname.trim() || !email.trim()) {
      setError("Nama dan email wajib diisi.")
      return
    }
    if (!isEdit && password.length < 8) {
      setError("Password minimal 8 karakter.")
      return
    }
    if (isEdit && password && password.length < 8) {
      setError("Password baru minimal 8 karakter.")
      return
    }

    const body: Record<string, string> = {
      fullname: fullname.trim(),
      email: email.trim(),
      role,
    }
    // password kosong saat edit = tidak diubah, jadi jangan dikirim
    if (password) body.password = password

    setSaving(true)
    try {
      const res = await fetch(isEdit ? `/api/users/${id}` : "/api/users", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.status === 401) {
        window.location.href = "/"
        return
      }

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error ?? "Gagal menyimpan data.")
        return
      }

      router.push("/admin/user-management")
    } catch {
      setError("Tidak bisa terhubung ke server.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/admin/user-management")}
      >
        ← Kembali
      </Button>

      <h1 className="mt-4 text-2xl font-bold">
        {isEdit ? "Edit User" : "Tambah User"}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {isEdit
          ? "Ubah data user, lalu klik Simpan."
          : "Isi data user baru, lalu klik Simpan."}
      </p>

      {loading ? (
        <p className="mt-6">Memuat data...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg border p-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <Input value={fullname} onChange={(e) => setFullname(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "staff")}
              className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              {isEdit ? "Password Baru (kosongkan jika tidak diubah)" : "Password"}
            </label>
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/user-management")}
            >
              Batal
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}