"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type User = {
  id: number
  fullname: string
  email: string
  role: string
  hasToken: boolean
}

type Pagination = {
  page: number
  pageSize: number
  totalUsers: number
  totalPages: number
}

const PAGE_SIZE = 10

export default function UserManagementPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadUsers = useCallback(async (targetPage: number) => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(
        `/api/users?page=${targetPage}&pageSize=${PAGE_SIZE}`
      )

      if (res.status === 401) {
        window.location.href = "/"
        return
      }

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error ?? "Gagal memuat data user.")
        return
      }

      setUsers(data.users)
      setPagination(data.pagination)
    } catch {
      setError("Tidak bisa terhubung ke server.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers(page)
  }, [page, loadUsers])

  async function handleDelete(user: User) {
    const yakin = window.confirm(
      `Hapus user "${user.fullname}"? Tindakan ini tidak bisa dibatalkan.`
    )
    if (!yakin) return

    setDeletingId(user.id)
    setError("")
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" })

      if (res.status === 401) {
        window.location.href = "/"
        return
      }

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error ?? "Gagal menghapus user.")
        return
      }

      // kalau yang dihapus satu-satunya data di halaman terakhir, mundur 1 halaman
      if (users.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        await loadUsers(page)
      }
    } catch {
      setError("Tidak bisa terhubung ke server.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen User</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola akun yang bisa masuk ke panel admin.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/user-management/form/add")}>
          Tambah User
        </Button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableCaption>
            {pagination
              ? `Total ${pagination.totalUsers} user.`
              : "Daftar user."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Sesi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  Belum ada user.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.id}</TableCell>
                  <TableCell>{u.fullname}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="capitalize">{u.role}</TableCell>
                  <TableCell>{u.hasToken ? "Sedang login" : "-"}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(`/admin/user-management/form/${u.id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === u.id}
                      onClick={() => handleDelete(u)}
                    >
                      {deletingId === u.id ? "Menghapus..." : "Hapus"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Halaman {pagination.page} dari {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={loading || page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={loading || page >= pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}