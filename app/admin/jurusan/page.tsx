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

type Jurusan = { id: number; name: string; description: string }

export default function JurusanPage() {
  const [data, setData] = useState<Jurusan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formTerbuka, setFormTerbuka] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [nama, setNama] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const muatData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/jurusan")

      if (res.status === 401) {
        window.location.href = "/"
        return
      }

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        setError(json?.error ?? "Gagal memuat jurusan.")
        return
      }

      setData(json.jurusan)
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
    setDeskripsi("")
    setError("")
    setFormTerbuka(true)
  }

  function bukaEdit(j: Jurusan) {
    setEditId(j.id)
    setNama(j.name)
    setDeskripsi(j.description)
    setError("")
    setFormTerbuka(true)
  }

  function tutup() {
    setNama("")
    setDeskripsi("")
    setEditId(null)
    setError("")
    setFormTerbuka(false)
  }

  async function simpan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (!nama.trim()) {
      setError("Nama jurusan wajib diisi.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(
        editId ? `/api/jurusan/${editId}` : "/api/jurusan",
        {
          method: editId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: nama.trim(), description: deskripsi.trim() }),
        }
      )

      if (res.status === 401) {
        window.location.href = "/"
        return
      }

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        setError(json?.error ?? "Gagal menyimpan jurusan.")
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

  async function hapus(j: Jurusan) {
    const yakin = window.confirm(`Hapus jurusan "${j.name}"?`)
    if (!yakin) return

    setDeletingId(j.id)
    setError("")
    try {
      const res = await fetch(`/api/jurusan/${j.id}`, { method: "DELETE" })

      if (res.status === 401) {
        window.location.href = "/"
        return
      }

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        setError(json?.error ?? "Gagal menghapus jurusan.")
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
          {editId ? "Edit Jurusan" : "Tambah Jurusan"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {editId
            ? "Ubah data jurusan, lalu klik Simpan."
            : "Isi data jurusan baru, lalu klik Simpan."}
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
          <div className="space-y-1">
            <label className="text-sm font-medium">Deskripsi</label>
            <textarea
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
            />
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
          <h1 className="text-2xl font-bold">Jurusan</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola daftar jurusan sekolah.
          </p>
        </div>
        <Button onClick={bukaTambah}>Tambah Jurusan</Button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableCaption>Daftar jurusan.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center">
                  Belum ada jurusan.
                </TableCell>
              </TableRow>
            ) : (
              data.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.id}</TableCell>
                  <TableCell>{j.name}</TableCell>
                  <TableCell>{j.description}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button size="sm" variant="outline" onClick={() => bukaEdit(j)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === j.id}
                      onClick={() => hapus(j)}
                    >
                      {deletingId === j.id ? "Menghapus..." : "Hapus"}
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