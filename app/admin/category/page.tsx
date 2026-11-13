"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Kategori = { id: number; name: string }

export default function CategoryPage() {
  const [data, setData] = useState<Kategori[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formTerbuka, setFormTerbuka] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [nama, setNama] = useState("")
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const muatData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/categories")

      if (res.status === 401) {
        window.location.href = "/"
        return
      }

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        setError(json?.error ?? "Gagal memuat kategori.")
        return
      }

      setData(json.categories)
    } catch {
      setError("Tidak bisa terhubung ke server.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    muatData()
  }, [muatData])

  function bukaTambah() {
    setEditId(null)
    setNama("")
    setError("")
    setFormTerbuka(true)
  }

  function bukaEdit(k: Kategori) {
    setEditId(k.id)
    setNama(k.name)
    setError("")
    setFormTerbuka(true)
  }

  function tutup() {
    setNama("")
    setEditId(null)
    setError("")
    setFormTerbuka(false)
  }

  async function simpan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (!nama.trim()) {
      setError("Nama kategori wajib diisi.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(
        editId ? `/api/categories/${editId}` : "/api/categories",
        {
          method: editId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: nama.trim() }),
        }
      )

      if (res.status === 401) {
        window.location.href = "/"
        return
      }

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        setError(json?.error ?? "Gagal menyimpan kategori.")
        return
      }

      tutup()
      await muatData()
    } catch {
      setError("Tidak bisa terhubung ke server.")
    } finally {
      setSaving(false)
    }
  }

  async function hapus(k: Kategori) {
    const yakin = window.confirm(`Hapus kategori "${k.name}"?`)
    if (!yakin) return

    setDeletingId(k.id)
    setError("")
    try {
      const res = await fetch(`/api/categories/${k.id}`, { method: "DELETE" })

      if (res.status === 401) {
        window.location.href = "/"
        return
      }

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        setError(json?.error ?? "Gagal menghapus kategori.")
        return
      }

      await muatData()
    } catch {
      setError("Tidak bisa terhubung ke server.")
    } finally {
      setDeletingId(null)
    }
  }

  if (formTerbuka) {
    return (
      <div className="p-6">
        <Button variant="outline" size="sm" onClick={tutup}>
          ← Kembali
        </Button>
        <h1 className="mt-4 text-2xl font-bold">
          {editId ? "Edit Kategori" : "Tambah Kategori"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {editId
            ? "Ubah nama kategori, lalu klik Simpan."
            : "Isi nama kategori baru, lalu klik Simpan."}
        </p>

        <form onSubmit={simpan} className="mt-6 space-y-4 rounded-lg border p-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama</label>
            <Input value={nama} onChange={(e) => setNama(e.target.value)} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button type="button" variant="outline" onClick={tutup}>
              Batal
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kategori</h1>
          <p className="mt-1 text-muted-foreground">
            Kelompokkan artikel berdasarkan kategori.
          </p>
        </div>
        <Button onClick={bukaTambah}>Tambah Kategori</Button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableCaption>Daftar kategori.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center">
                  Belum ada kategori.
                </TableCell>
              </TableRow>
            ) : (
              data.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.id}</TableCell>
                  <TableCell>{k.name}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button size="sm" variant="outline" onClick={() => bukaEdit(k)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === k.id}
                      onClick={() => hapus(k)}
                    >
                      {deletingId === k.id ? "Menghapus..." : "Hapus"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}